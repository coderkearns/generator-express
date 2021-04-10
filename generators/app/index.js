"use strict"
const Generator = require("yeoman-generator")
const chalk = require("chalk")
const yosay = require("yosay")

const fs = require("fs")

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }

  _tpla(tplPath, destPath, props) {
    this.fs.copyTpl(
      this.templatePath(tplPath),
      this.destinationPath(destPath),
      props
    )
  }

  _tpl(path, props) {
    this._tpla("_" + path, path, props)
  }

  _cp(fromPath, destPath) {
    this.fs.copy(this.templatePath(fromPath), this.destinationPath(destPath))
  }

  async prompting() {
    this.props = await this.prompt([
      {
        type: "imput",
        name: "name",
        message: "What is the name?",
        default: this.appname,
      },
    ])
  }

  writeConfig() {
    this._tpl("package.json", { name: this.props.name })
  }

  writeFolders() {
    let name = this.props.name
    this._tpl("views", { name })
    this._tpl("public", { name })
    this._tpl("routes", { name })
  }

  writeFiles() {
    let name = this.props.name
    this._cp("tpl.gitignore", ".gitignore")
    this._tpl("app.js", { name })
    this._tpl("index.js", { name })
  }

  install() {
    this.log(
      yosay(`Finished creating files! Running ${chalk.red("npm install")} from you now!`)
    )
    this.npmInstall()
  }
}
