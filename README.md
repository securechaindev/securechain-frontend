# Secure Chain Frontend

User Interface for Secure Chain's open-source cybersecurity tools.

## Development requirements

1. [Docker](https://www.docker.com/) to deploy the tool.
2. [Docker Compose](https://docs.docker.com/compose/) for container orchestration.
3. It is recommended to use a GUI such as [MongoDB Compass](https://www.mongodb.com/en/products/compass).
4. The Neo4J browser interface to visualize the graph built from the data is in [localhost:7474](http://0.0.0.0:7474/browser/) when the container is running.
5. Node 18.19.1 or higher.

## Deployment with docker

### 1. Clone the repository

Clone the repository from the official GitHub repository:

```bash
git clone https://github.com/securechaindev/securechain-frontend.git
cd securechain-frontend
```

### 2. Configure environment variables

Create a `.env.local` file from the `.env.template` file and place it in the root directory.

#### Get API Keys

- How to get a _GitHub_ [API key](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

- Modify the **Json Web Token (JWT)** secret key and algorithm with your own. You can generate your own secret key with the command **openssl rand -base64 32**.

### 3. Create Docker network

Ensure you have the `securechain` Docker network created. If not, create it with:

```bash
docker network create securechain
```

### 4. Databases containers

For graphs and vulnerabilities information you need to download the zipped [data dumps](https://doi.org/10.5281/zenodo.16739080) from Zenodo. Once you have unzipped the dumps, inside the root folder run the command:

```bash
docker compose up --build
```

The containerized databases will also be seeded automatically.

### 5. Start the application

Run the command from the project root:

```bash
docker compose -f dev/docker-compose.yml up --build
```

### 6. Access the application

The web will be available at [http://localhost](http://localhost).

## Node Environment

The project uses Node 18.19.1 and the dependencies are listed in `package.json`.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[GNU General Public License 3.0](https://www.gnu.org/licenses/gpl-3.0.html)

## Links

- [Secure Chain Team](mailto:hi@securechain.dev)
- [Secure Chain Organization](https://github.com/securechaindev)
- [Secure Chain Documentation](https://securechaindev.github.io/)
