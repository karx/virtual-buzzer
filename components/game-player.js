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
    init: function () {
      var data = this.data;
      var el = this.el;
      console.log('wiki entithy data: ', data);
      // Create Main Entity
      this.parentEntity = document.createElement("a-box");
      this.el.appendChild(this.parentEntity);
      this.parentEntity.setAttribute("position", '0 0 0');
      this.parentEntity.setAttribute("width", "2");
      this.parentEntity.setAttribute("depth", "0.2");
      this.parentEntity.setAttribute("height", "2");
      this.parentEntity.setAttribute('color','#E3E3E3');
      this.parentEntity.setAttribute("static-body", "true");
  
      //Create Text Entity
      this.textEntity = document.createElement('a-text');
      this.el.appendChild(this.textEntity);
      this.textEntity.setAttribute("position", '-0.8 1.8 0');
      this.textEntity.setAttribute("color", '#000');
      this.textEntity.setAttribute("scale", '2 2 2');
      this.textEntity.setAttribute("font", 'mozillavr');
  
      //Create Text-type Entity
      this.typetextEntity = document.createElement('a-text');
      this.el.appendChild(this.typetextEntity);
      this.typetextEntity.setAttribute("color", '#31094B');
      this.typetextEntity.setAttribute("position", 'w-0.9 0 0.5');
      this.typetextEntity.setAttribute("font", 'mozillavr');
      this.typetextEntity.setAttribute("scale", '1.2 1.2 1.2');
  
      
      //Create Connection-type Entity
      this.connectionType = document.createElement('a-text');
      this.el.appendChild(this.connectionType);
      this.connectionType.setAttribute("color", '#337777');
      this.connectionType.setAttribute("position", '-0.9 -1 0.5');
      this.connectionType.setAttribute("font", 'mozillavr');
      this.connectionType.setAttribute("scale", '1.1 1.1 1.1');
    },
    update: function () {
      let entityEl = this.parentEntity;
  
  
  
      this.parentEntity.setAttribute("material", `src: url(${handleSvg(this.data.image_url)})`);
      this.textEntity.setAttribute("value", this.data.label);
      this.typetextEntity.setAttribute("value", this.data.instanceof);
      this.connectionType.setAttribute("value", this.data.connectionType);
    },
    // ...
    addNewImage: function (dataToUse) {
      let entityEl = this.parentEntity;
  
  
  
      this.parentEntity.setAttribute("material", `src: url(${handleSvg(this.data.image_url)})`);
      this.textEntity.setAttribute("value", this.data.label);
      this.typetextEntity.setAttribute("value", this.data.instanceof);
      this.connectionType.setAttribute("value", this.data.connectionType);
    }
  });
  
  
  function handleSvg(image_url) {
    console.log(image_url);
    if (image_url.split('.').pop() === 'svg') {
      console.log(`${image_url} is SVG` );
      let img_split_arr = image_url.split('.');
      img_split_arr[img_split_arr.length-1]='png';
      return img_split_arr.join('.');
    } else {
      return image_url;
    }
  }