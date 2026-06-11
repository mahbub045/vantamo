import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';

export class DatabaseWrapper {
  private db: SqlJsDatabase;
  private filePath: string;
  private dirty = false;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(db: SqlJsDatabase, filePath: string) {
    this.db = db;
    this.filePath = filePath;
  }

  pragma(str: string): void {
    try {
      this.db.run(`PRAGMA ${str}`);
    } catch {
      // sql.js ignores unsupported pragmas
    }
  }

  exec(sql: string): void {
    this.db.run(sql);
    this.markDirty();
  }

  prepare(sql: string) {
    const db = this.db;
    const self = this;

    return {
      run(...params: unknown[]) {
        db.run(sql, params as any[]);
        self.markDirty();
        return { changes: db.getRowsModified() };
      },
      get(...params: unknown[]) {
        const stmt = db.prepare(sql);
        stmt.bind(params as any[]);
        let row: Record<string, unknown> | undefined;
        if (stmt.step()) row = stmt.getAsObject() as Record<string, unknown>;
        stmt.free();
        return row;
      },
      all(...params: unknown[]) {
        const rows: Record<string, unknown>[] = [];
        const stmt = db.prepare(sql);
        stmt.bind(params as any[]);
        while (stmt.step()) rows.push(stmt.getAsObject() as Record<string, unknown>);
        stmt.free();
        return rows;
      },
    };
  }

  close(): void {
    this.flushSave();
    this.db.close();
  }

  private markDirty(): void {
    this.dirty = true;
    if (!this.saveTimer) {
      this.saveTimer = setTimeout(() => this.flushSave(), 300);
    }
  }

  private flushSave(): void {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
    if (!this.dirty) return;
    const data = this.db.export();
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(this.filePath, Buffer.from(data));
    this.dirty = false;
  }
}

export async function createDatabase(filePath: string): Promise<DatabaseWrapper> {
  const SQL = await initSqlJs();

  let db: SqlJsDatabase;
  if (fs.existsSync(filePath)) {
    db = new SQL.Database(fs.readFileSync(filePath));
  } else {
    db = new SQL.Database();
  }

  return new DatabaseWrapper(db, filePath);
}