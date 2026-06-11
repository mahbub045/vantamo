import { useEffect } from 'react';
import { Users, Shield, Crown, UserIcon } from 'lucide-react';
import { useTeamStore } from '../stores/teamStore';
import Avatar from '../components/ui/Avatar';

const ROLE_ICON: Record<string, typeof Users> = {
  admin: Crown,
  manager: Shield,
  member: UserIcon,
};

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrator',
  manager: 'Manager',
  member: 'Team Member',
};

export default function TeamPage() {
  const { members, loading, fetch: fetchTeam } = useTeamStore();

  useEffect(() => { fetchTeam(); }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold font-display">Team</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{members.length} team members</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading && members.length === 0 ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="card p-5 h-28 animate-shimmer bg-gradient-to-r from-[var(--surface)] via-[var(--bg-subtle)] to-[var(--surface)] bg-[length:200%_100%]" />
          ))
        ) : (
          members.map((member, i) => {
            const RoleIcon = ROLE_ICON[member.role] || UserIcon;
            return (
              <div
                key={member.id}
                className="card p-5 animate-slide-up opacity-0 flex items-center gap-4 hover:border-[var(--accent)]/30 transition-all"
                style={{ animationDelay: `${i * 0.06}s`, animationFillMode: 'forwards' }}
              >
                <Avatar name={member.name} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[var(--text)]">{member.name}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{member.email}</p>
                </div>
                <div className="flex items-center gap-1.5 accent-bg h-7 px-2.5 rounded-lg">
                  <RoleIcon size={14} />
                  <span className="text-xs font-medium">{ROLE_LABELS[member.role]}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
