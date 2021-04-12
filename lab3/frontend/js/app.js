var app = new Vue({
  el: "#hamming-encoder",
  data: {
    dataBits: [],
    status: "",
    numberOfDataBits: 4,
  },
  created: function () {
    this.initDataBits(4);
  },
  methods: {
    initDataBits: function () {
      this.dataBits = [];
      for (var i = 0; i < this.numberOfDataBits; i++) {
        var bit = { data: null };
        this.dataBits.push(bit);
      }
    },
    send: function () {
      if (this.validate(this.dataBits) === true) {
        var encodedMessage = this.encode(this.dataBits);
        // this.status = encodedMessage + ' encoded sent to server ';
        console.log(encodedMessage, this.dataBits);
        return axios
          .put("http://localhost:3000/message", { bits: encodedMessage })
          .then((response) => (this.status = response.data));
      }
    },

    encode: function (bits) {
      // This function must be changed to allow any
      // number of data bits
      // Right now it only works for 16 data bits 
      console.log("Bits", bits);
      var c16=this.parity(
        parseInt(bits[11].data) + parseInt(bits[12].data) + parseInt(bits[13].data) + 
       parseInt(bits[14].data) + parseInt(bits[15].data)
      );
      var c8=this.parity( 
        parseInt(bits[4].data) + parseInt(bits[5].data) + parseInt(bits[6].data) + 
        parseInt(bits[7].data) + parseInt(bits[8].data) + parseInt(bits[9].data) +
        parseInt(bits[10].data)

      );
      var c4 = this.parity(
        parseInt(bits[1].data) + parseInt(bits[2].data) + parseInt(bits[3].data) + 
        parseInt(bits[7].data) + parseInt(bits[8].data) + parseInt(bits[9].data) +
        parseInt(bits[10].data) + parseInt(bits[14].data) + parseInt(bits[15].data)
      );
      var c2 = this.parity(
        parseInt(bits[0].data) + parseInt(bits[2].data) + parseInt(bits[3].data) + 
        parseInt(bits[5].data) + parseInt(bits[6].data) + parseInt(bits[9].data) +
        parseInt(bits[10].data) + parseInt(bits[12].data) + parseInt(bits[13].data)
      );
      var c1 = this.parity(
        parseInt(bits[0].data) + parseInt(bits[1].data) + parseInt(bits[3].data)+
        parseInt(bits[4].data) + parseInt(bits[6].data) + parseInt(bits[8].data)+
        parseInt(bits[10].data) + parseInt(bits[11].data) + parseInt(bits[13].data)+
        parseInt(bits[15].data)
      );

      return [
        c1,
        c2,
        parseInt(bits[0].data),
        c4,
        parseInt(bits[1].data),
        parseInt(bits[2].data),
        parseInt(bits[3].data),
        c8 ,
        parseInt(bits[4].data),
        parseInt(bits[5].data),
        parseInt(bits[6].data),
        parseInt(bits[7].data),
        parseInt(bits[8].data),
        parseInt(bits[9].data),
        parseInt(bits[10].data), 
        c16,
        parseInt(bits[11].data),
        parseInt(bits[12].data),
        parseInt(bits[13].data),
        parseInt(bits[14].data),
        parseInt(bits[15].data),


      ];
    },
    parity: function (number) {
      return number % 2;
    },
    validate: function (bits) {
      for (var i = 0; i < bits.length; i++) {
        if (this.validateBit(bits[i].data) === false) return false;
      }
      return true;
    },
    validateBit: function (character) {
      if (character === null) return false;
      return parseInt(character) === 0 || parseInt(character) === 1;
    },
  },
});
