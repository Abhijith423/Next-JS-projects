export default function gallery() {
  const images = ["/images/jpg.1.jpg", "/images/jpg.2.jpg", "/images/jpg.3.jpg"];

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {images.map((src, i) => (
        <img key={i} src={src} width="650" />
      ))}
    </div>
  );
}
