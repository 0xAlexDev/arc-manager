export default function SpaceHeader() {
  return (
    <header
      style={{
        width: "100%",
        padding: "24px 0",
        background: "linear-gradient(90deg, #a30000, #d4a017, #228b22, #20b2aa)", 
        // rosso scuro → giallo scuro → verde scuro → azzurro acqua leggermente più chiari
        color: "#fff",
        textAlign: "center",
        fontSize: "2rem",
        fontWeight: "bold",
        letterSpacing: "2px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)",
        position: "relative",
        zIndex: 10,
        borderBottom: "3px solid rgba(255,255,255,0.2)",
      }}
    >
      ARC RAIDER MANAGER
    </header>
  );
}
