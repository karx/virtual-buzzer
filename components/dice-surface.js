AFRAME.registerComponent("game-player", {
    schema: {
        id: { default: "1" },
      label: { type: "string", default: "Entity" },
      instanceof: { type: "string", default: "Entity" },
      connectionType: { type: "string" },
      description: { type: "string" },
      image_url: { type: "string" },
      claims: { type: "string" }
    },
    init: function() {

    },
    update: function() {

    }
    