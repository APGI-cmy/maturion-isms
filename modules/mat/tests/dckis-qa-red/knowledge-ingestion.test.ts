  const readAllAiCentreMigrations = (): AiCentreMigration[] => {
    const dirExists = fs.existsSync(migrationsDirectory);
    if (!dirExists) {
      return [];
    }
    return fs.readdirSync(migrationsDirectory).map(file => {
      const filePath = path.join(migrationsDirectory, file);
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    });
  };