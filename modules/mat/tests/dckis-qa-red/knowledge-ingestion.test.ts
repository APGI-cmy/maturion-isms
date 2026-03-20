  const readAllAiCentreMigrations = (): AiCentreMigration[] => {
    const dirExists = fs.existsSync(migrationsDirectory);
    // Replace the line below with early return []
    expect(dirExists).toBe(true);
    return fs.readdirSync(migrationsDirectory).map(file => {
      const filePath = path.join(migrationsDirectory, file);
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    });
  };