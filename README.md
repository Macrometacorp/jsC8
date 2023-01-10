## jsc8 SDK

![npm](https://img.shields.io/npm/v/jsc8)
![npm type definitions](https://img.shields.io/npm/types/jsc8)
![npm](https://img.shields.io/npm/dm/jsc8)

Javacript SDK for the Macrometa Global Data Mesh.

---

# ⚙️ Installation

- From NPM

```bash
npm install jsc8
```

- From source:

```bash
git clone https://github.com/macrometacorp/jsc8.git
cd jsc8
npm install
npm run dist
```

## 🐺 Enable pre-commit hooks

On every commit we will run pre-commit hooks. Pre-commit hooks are running
pretty-quick package that runs prettier code formatting. You can find more about
pretty-quick and prettier
[here. (Option 2.)](https://prettier.io/docs/en/precommit.html) To enable
pre-commit hooks you need to run once:

```bash
 npx husky install
```

## 🔐 Authentication

Currently, jsc8 supports API Key, JWT token, username and password
authentication. Preferred method needs to be passed during client creation. We
highly recommend that you use API key or JWT token.

You can create you test Macrometa account with this
[link](https://auth-play.macrometa.io/sign-up).

After that you can check out our
[getting started code examples](https://github.com/Macrometacorp/jsC8/blob/master/GETTING_STARTED.md).

## 🪛 Update jsC8

```bash
npm update jsc8
```

## 📗 Examples

You can find code examples in our
[getting started examples](https://github.com/Macrometacorp/jsC8/blob/master/GETTING_STARTED.md).

## 🆘 Macrometa Support

If you have any trouble or need help while using SDK please contact
[support@macrometa.com](mailto:support@macrometa.com).

## ⚖️ License

This library is distributed under the Apache License 2.0 license found in the
[License](https://github.com/Macrometacorp/jsC8/blob/master/LICENSE).

## 📜 Code of Conduct

This project and everyone participating in it is governed by the
[Code of Conduct](https://github.com/Macrometacorp/jsC8/blob/master/CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report
unacceptable behavior to [product@macrometa.com](mailto:product@macrometa.com).
