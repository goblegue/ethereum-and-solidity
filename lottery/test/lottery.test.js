const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../compile");

let accounts;
let lottery;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  lottery= await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Lottery", () => {
  it("deploys a contract", () => {
    assert.ok(lottery.options.address);
  });
  it("has a manager",async () => {
    const manager = await lottery.methods.manager().call();
    assert.equal(manager , accounts[0]);
  } );
  it('one player can enter ',async ()=>{
    await lottery.methods.enter().send({ 
      from : accounts[0],
      value : web3.utils.toWei("0.02","ether")
    });
    const players= await lottery.methods.allPlayers().call();

    assert.equal(accounts[0], players[0]);
    assert.equal(1,players.length);
  });
  it('multiple players can enter ',async ()=>{

    await lottery.methods.enter().send({ 
      from : accounts[0],
      value : web3.utils.toWei("0.02","ether")
    });
    await lottery.methods.enter().send({ 
      from : accounts[1],
      value : web3.utils.toWei("0.02","ether")
    });
    await lottery.methods.enter().send({ 
      from : accounts[2],
      value : web3.utils.toWei("0.02","ether")
    });
    const players= await lottery.methods.allPlayers().call();

    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(3,players.length);
  });
  it("require minimum amount amount of ether to enter",async () => {
    try{
      await lottery.methods.enter().send({
        from : accounts[0],
        value : 0
      });
      assert(false);
    }
    
    catch(err){
      assert(err);
    }
  });
  it("manager can only pick Winner", async () => {
    try{
      await lottery.methods.pickWinner().send({
        from : accounts[1],
      });
      assert(false);
    }
    catch(err){
      assert(err);
    }
  })
  it('can pick a winner',async ()=>{

    await lottery.methods.enter().send({ 
      from : accounts[0],
      value : web3.utils.toWei("0.02","ether")
    });
    await lottery.methods.enter().send({ 
      from : accounts[1],
      value : web3.utils.toWei("0.02","ether")
    });
    await lottery.methods.enter().send({ 
      from : accounts[2],
      value : web3.utils.toWei("0.02","ether")
    });
    await lottery.methods.pickWinner().send({
      from : accounts[0],
    });

    const finalbalance = await web3.eth.getBalance(lottery.options.address);
    const players= await lottery.methods.allPlayers().call();

    
    assert.equal(0, finalbalance);;
    assert.equal(0,players.length);
  });


});
