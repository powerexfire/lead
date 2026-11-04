import { useEffect } from "react";
import { SettingsPanel } from "@/components/powerex/SettingsPanel";
import { usePowerexWorkspace } from "@/components/powerex/WorkspaceContext";

const SettingsPage = () => {
  const {
    session,
    users,
    activity,
    currentRole,
    webhookUrl,
    isWebhookLoading,
    isLoading,
    isUserLoading,
    assignRole,
    updateWebhookUrl,
    loadActivity,
    loadUsers,
  } = usePowerexWorkspace();

  useEffect(() => {
    void loadActivity();
    void loadUsers(true);
  }, [loadActivity, loadUsers]);

  return (
    <div className="grid gap-6">
      <SettingsPanel
        userEmail={session.user.email}
        userId={session.user.id}
        currentRole={currentRole}
        users={users}
        activity={activity}
        webhookUrl={webhookUrl}
        isWebhookLoading={isWebhookLoading}
        onRefreshActivity={loadActivity}
        onRefreshUsers={() => loadUsers(false)}
        onRoleChange={assignRole}
        onUpdateWebhook={updateWebhookUrl}
        isLoading={isLoading}
        isUserLoading={isUserLoading}
      />
    </div>
  );
};

export default SettingsPage;
