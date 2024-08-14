import * as Notifications from 'expo-notifications';

export const scheduleNotification = async ({ title, body, trigger }) => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: trigger,
    });
    console.log("Notification scheduled successfully.");
  } catch (error) {
    console.error("Error scheduling notification:", error);
    throw error;
  }
};

export const getNotificationPermissionStatus = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  return status;
};

export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status;
};