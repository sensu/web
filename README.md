<p align="center">
  <a href="https://www.sensu.io/">
    <img alt="Sensu"
      src="https://raw.githubusercontent.com/sensu/web/828c7a0c2a6abb7ea215ca6ded903ba26045f542/logo.png"
      width="80"
    />
  </a>
</p>

<h3 align="center">
  Sensu Go Web
</h3>

<p align="center">
  A web interface for insight and management of your <a href="https://sensu.io/features">Sensu Go</a> clusters.
</p>

<p align="center">
  <a href="#">
    <img src="https://img.shields.io/github/commit-activity/m/sensu/web.svg?style=flat" />
  </a>
  <a href="https://github.com/sensu/web/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/sensu/web.svg?style=flat" />
  </a>
  <a href="https://circleci.com/gh/sensu/web">
    <img src="https://circleci.com/gh/sensu/web/tree/master.svg?style=shield&circle-token=0b15707495fa6899226391b58d73a2526d87f9d4" />
  </a>
</p>

## Getting Started

To start the UI, simply run the following:

```bash
yarn install
NODE_ENV=production PORT=80 API_URL=https://my-sensu-backend-api:8080 yarn node scripts serve
```
For more detailed installation instructions, see [INSTALL.md](INSTALL.md)

## Contributing

Sensu is and always will be open source, and we continue to highly value
community contribution. For guidelines on how to contribute to this project, how
to hack on Sensu, and information about what we require from project
contributors, please see [CONTRIBUTING.md].

[sensu go]: https://sensu.io/products/core
[installation documentation]: https://docs.sensu.io/sensu-go/latest/installation/install-sensu/
[contributing.md]: CONTRIBUTING.md
