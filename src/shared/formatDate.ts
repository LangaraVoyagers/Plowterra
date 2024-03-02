const formatDate = (epoch: number, options={
    year: "numeric" as const,
    month: "short" as const,
    day: "numeric" as const,
  }): string => {
  return new Date(epoch).toLocaleDateString("en-GB", options);
}

export default formatDate;