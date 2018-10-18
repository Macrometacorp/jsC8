'use strict';
const router = require('@c8/foxx/router')();
module.context.use(router);
router.get((req, res) => {
  res.send({hello: 'world'});
});

