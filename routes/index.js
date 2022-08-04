const { Engine } = require("bpmn-engine");
const { EventEmitter } = require("events");
const express = require("express");

const router = express.Router();
let source = "";
const listener = new EventEmitter();
let engine = null;
let eldata = null;

router.get("/", (req, res) => {
  res.send("It works!");
});

router.post("/bpmn-source", (req, res) => {
  source = req.query.source.toString();
  const id = Math.floor(Math.random() * 10000);
  engine = new Engine({
    name: "execution example",
    source,
    variables: {
      id,
    },
  });

  listener.on("activity.end", (elementApi, engineApi) => {
    if (elementApi.content.output)
      engineApi.environment.output[elementApi.id] = elementApi.content.output;
    const data = engineApi.getState();
    if (elementApi.content.output && data) {
      console.log(1);
      eldata = data;
    }
  });

  res.send({ source: source });
});

router.get("/bpmn-execute", (req, res, next) => {
  listener.once("wait", (elementApi) => {
    elementApi.signal({
      sirname: "von Rosen",
    });
  });
  setTimeout(() => {
    if (eldata) res.send(eldata);
  }, 3);

  engine.execute(
    {
      listener,
    },
    (err, execution) => {
      if (err);
      res.send("s");
    }
  );
});

module.exports = router;
