module.exports = function Cart(oldCart) {
    this.items= oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id){
        var storedItem = this.items[id];
        if(!storedItem){
            storedItem = this.items[id] = {item: item, qty:0,  price: 0};
        }
        storedItem.qty ++;
        storedItem.price = storedItem.item.salePrice * storedItem.qty;
        this.totalQty ++;
        // if(storedItem.qty > 1){
        //     this.totalPrice += storedItem.price - this.totalPrice;
        // }else{
        // this.totalPrice = 0;
        this.totalPrice += storedItem.price; 
        // }
    }
    
    this.generateArray = function(){
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr; 
    }

    this.remove = function(arr, id){
        // let arr = this.generateArray();
        arr.forEach((element, index) => {
            if(element.item._id == id){
                element.splice(index, 1);
            }
        })
        return arr;
    }

};