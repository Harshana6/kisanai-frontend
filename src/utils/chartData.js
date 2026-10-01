export const getCropHealthHistory = () => {
  const activities =
    JSON.parse(localStorage.getItem("activities")) || [];

  return activities
    .filter(a => a.type === "leaf")
    .slice(0, 7)
    .reverse()
    .map((a, index) => ({
      day: `Day ${index + 1}`,
      confidence: a.confidence || 80
    }));
};