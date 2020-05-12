AFRAME.registerComponent("game-board", {
    schema: {
      rowsize: { default: "10" },
      colsize: { type: "string", default: "10" },
      flux: { type: "string", default: "5" },
      chaosfactor: { type: "string", default: "5" },
      description: { type: "string" },
      image_url: { type: "string" }
    },
    init: function () {
      var data = this.data;
      var el = this.el;
      console.log('game data: ', data);
      // Create Main Entity
      this.init_board(this.data.rowsize, this.data.colsize);
   
    },
    update: function () {
      let entityEl = this.parentEntity;
        console.log('update called');
    },
    // ...
    addNewImage: function (dataToUse) {
      
    },
    init_board(rowsize , colsize) {
        
      let board_matrix = [];
      let box_count = rowsize * colsize;
      for (let index = 0; index < box_count; index++) {
        let new_box_position = `-${index%rowsize} 0 ${ (index/rowsize)}`;
        let new_box = document.createElement('a-box');
        new_box.setAttribute('color',`#000`);
        new_box.setAttribute('position',new_box_position);
        new_box.setAttribute('position',new_box_position);
        new_box.setAttribute('scale',`0.4 0.4 0.4`);
        
        console.log('creating box');

        
        let box_text_position = `-${index%rowsize} ${0.4 + index * 0.01} ${ (index/rowsize)}`;
        let box_text = document.createElement('a-text');
        
       box_text.setAttribute("color", '#E1E9CB');
       box_text.setAttribute("position", box_text_position);
       box_text.setAttribute("font", 'mozillavr');
       box_text.setAttribute("scale", '1.2 1.2 1.2');
       box_text.setAttribute("rotation", `-20 180 0`);
       box_text.setAttribute("value", index+1);
       

        board_matrix.push(
            { 
                box: new_box,
                box_text: box_text
            });
        this.el.appendChild(new_box);
        this.el.appendChild(box_text);
      }
      let ready_box_position = `1 0 0`;

      let ready_box = document.createElement('a-box');
      ready_box.setAttribute('color',`#F3F3F3`);
      ready_box.setAttribute('position',ready_box_position);
      ready_box.setAttribute('position',ready_box_position);
      ready_box.setAttribute('scale',`0.7 0.7 0.7`);
      this.el.appendChild(ready_box);
      
      console.log('creating box');
      this.data.board_matrix = board_matrix;
    }
  });
  
  // might come in handy
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