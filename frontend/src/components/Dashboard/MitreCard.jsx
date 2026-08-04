function MitreCard({ stats }) {
  const mitre = stats.mitre;

  if (!mitre) return null;

  return (
    <div className="placeholder-card">
      <h2>🛡 MITRE ATT&CK Mapping</h2>

      <br />

      <h3>Technique ID</h3>
      <p>
        <strong>{mitre.id}</strong>
      </p>

      <br />

      <h3>Technique</h3>
      <p>{mitre.name}</p>

      <br />

      <h3>Description</h3>
      <p>{mitre.description}</p>
    </div>
  );
}

export default MitreCard;