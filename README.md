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
  A web interface for insight and management of your <a href="https://sensu.io/products/core">Sensu Go</a> clusters.
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

## Roadmap

As of version 6.0, the official Sensu web app has moved to the commercial product codebase. Users who want an officially supported web app for use with Sensu Go should try the commercial distribution available at https://sensu.io/downloads 

Users who download and compile Sensu Go from source and want a web UI will need to download and run this web app as a separate component (see [INSTALL.md](INSTALL.md)). Please note that the web interface included in the commercial distribution no longer shares a common codebase with this project. For more details regarding these changes, please see [Building a better UI for Sensu].

### Goals

The primary goal of this project was to offer a simple web interface that provides visibility into Sensu Go's "stateful" data (e.g., real-time invetory and real-time event dashboards). At this time, this includes the following:

* Basic auth (login using Sensu Go user credentials)
* Namespace switching
* Views reflecting event, entity, and silence state. (Scoped by namespace.)

### Non-Goals

This project does not aim to provide a web-based interface for every feature of the open-source Sensu Go platform, specifically including the configuration of Sensu Go pipelines. As a result, certain features of this project may break with new releases of Sensu Go. The Sensu Engineering team will review and merge PRs submitted by the community, and/or periodically publish new releases to mark certain features as "deprecated" (or just remove them).

_NOTE: although "PRs are **always** welcome" (!), any PR which implements features that are non-goals of this project may be closed as "won't fix". Furthermore, any issues and/or PRs proposing enhancements that are already implemented -OR- that are on our roadmap for the commercial distribution **may** also be closed as "won't fix"; conversely, we may from time to time choose to port features from the commercial distribution into this project._

This project will maintain its permissive MIT license, and may be used as a baseline for new Sensu Go web interface projects and/or forks of this project.

## Getting Started

To start the UI, simply run the following:

```bash
yarn install
NODE_ENV=production PORT=80 API_URL=https://my-sensu-backend-api:8080 yarn node scripts serve
```
For more detailed installation instructions, see [INSTALL.md](INSTALL.md)

## Contributing

Sensu is and always will be open source, and we continue to highly value
community contributions. For guidelines on how to contribute to this project, how
to hack on Sensu, and information about what we require from project
contributors, please see [CONTRIBUTING.md].

[sensu go]: https://sensu.io/products/core
[installation documentation]: https://docs.sensu.io/sensu-go/latest/installation/install-sensu/
[contributing.md]: CONTRIBUTING.md
[Building a better UI for Sensu]: https://discourse.sensu.io/t/building-a-better-ui-for-sensu/1859