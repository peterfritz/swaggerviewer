const truncateText = (text: string, maxLength: number) => (
  text.length > maxLength ? (
    `${text.substring(0, maxLength)}...`
  ) : (
    text
  )
);

export default truncateText;
