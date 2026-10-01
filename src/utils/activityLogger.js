export const saveActivity = (activity) => {
  const activities =
    JSON.parse(localStorage.getItem("activities")) || [];

  activities.unshift({
    ...activity,
    date: new Date().toLocaleString(),
  });

  // Keep only latest 5 activities
  localStorage.setItem(
    "activities",
    JSON.stringify(activities.slice(0, 5))
  );
};