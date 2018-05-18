var ethers = require('ethers');
const {shell} = require('electron')
const {dialog} = require('electron').remote
const clipboardy = require('clipboardy');
var fs = require('fs');

var providers = ethers.providers;
var Wallet = ethers.Wallet;

var myWallet;

var tokenBalance = 0;
var ethBalance = 0;
var version = "0.0.1";

var provider = new providers.EtherscanProvider(false);

var tokenContract;
var TOKEN_ADDRESS = '0x2eb86e8fc520e0f6bb5d9af08f924fe70558ab89'
const TOKEN_ABI = [ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string", "value": "Logarithm" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256", "value": "6666667000000000" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8", "value": "8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_value", "type": "uint256" } ], "name": "burn", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "burnFrom", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string", "value": "LGR" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_extraData", "type": "bytes" } ], "name": "approveAndCall", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" }, { "name": "", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [ { "name": "initialSupply", "type": "uint256", "index": 0, "typeShort": "uint", "bits": "256", "displayName": "initial Supply", "template": "elements_input_uint", "value": "" }, { "name": "tokenName", "type": "string", "index": 1, "typeShort": "string", "bits": "", "displayName": "token Name", "template": "elements_input_string", "value": "" }, { "name": "tokenSymbol", "type": "string", "index": 2, "typeShort": "string", "bits": "", "displayName": "token Symbol", "template": "elements_input_string", "value": "" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Burn", "type": "event" } ];

tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);


function OpenEtherScan(txid) {
  shell.openExternal('https://etherscan.io/tx/'+txid)
}

function OpenGithubRepo() {
  shell.openExternal('https://github.com/logarithm-network/logarithm-wallet')
}

function OpenGithubReleases() {
  shell.openExternal('https://github.com/logarithm-network/logarithm-wallet/releases')
}

function OpenHunterGithub() {
  shell.openExternal('https://logarithm.network')
}

function OpenMyEtherWallet() {
  shell.openExternal('https://www.myetherwallet.com')
}

function CheckForUpdates() {
  var versionFile = "https://raw.githubusercontent.com/logarithm-network/logarithm-wallet/master/VERSION";
  $.get(versionFile, function(data, status){
      var verCheck = data.replace(/^\s+|\s+$/g, '');
        if (version != verCheck) {
          alert("There's a new Update for Logarithm Token Wallet! New Version: "+data);
          OpenGithubReleases();
        } else {
          alert("You have lastest Logarithm Token Wallet.");
        }
    });
}

function CheckETHAvailable() {
    var send = parseFloat($("#send_ether_amount").val());
    var fee = parseFloat($("#ethtxfee").val());
    var spendable = parseFloat(ethBalance - (send + fee));
    console.log('CheckETH:: ETHBalance:'+ethBalance+', Send:'+send+', Fee:'+fee+', Spendable:'+spendable);
    if (spendable >= 0) {
        $("#sendethbutton").prop("disabled", false);
    } else {
        $("#sendethbutton").prop("disabled", true);
    }
}

function CheckTokenAvailable() {
    var send = parseFloat($("#send_amount_token").val());
    var fee = parseFloat($("#tokentxfee").val());
    var spendable = parseFloat(ethBalance - fee);
    var gidecektoken  = tokenBalance - parseFloat($("#send_amount_token").val());
    console.log('CheckToken:: ETHBalance:'+ethBalance+', Send:'+send+', Fee:'+fee+', Spendable:'+spendable);
    if (spendable >= 0 && gidecektoken>=0) {
        $("#sendtokenbutton").prop("disabled", false);
    } else {
        $("#sendtokenbutton").prop("disabled", true);
    }
}


setInterval(function() {
    if (myWallet) updateBalance();
}, 5000);

function UseKeystore() {
    HideButtons();
    $("#keystoreupload").attr("class", "");
}

function UsePrivateKey() {
    HideButtons();
    $("#privatekey").attr("class", "");
}

function UseNewWallet() {
    HideButtons();
    $("#createnewwallet").attr("class", "");
}


function CopyAddress() {
    clipboardy.writeSync(myWallet.address);
    alert("Address Copied: " + myWallet.address);
}


function HideButtons() {
    $("#keystoreupload").attr("class", "hidden");
    $("#createnewwallet").attr("class", "hidden");
    $("#privatekey").attr("class", "hidden");
}

function LogoutWallet() {
  $("#walletInfo").addClass("hidden");
  $("#addressArea").addClass("hidden");
  $("#walletActions").addClass("hidden");
  $("#WalletGetInputs").removeClass("hidden");
  $("#keystoreupload").addClass("hidden");
  $("#createnewwallet").addClass("hidden");
  $("#privatekey").addClass("hidden");
  $(".options").show();
  $(".walletInput").show();
}


function QuitAppButton() {
  const remote = require('electron').remote
  remote.getCurrentWindow().close()
}


function OpenPrivateKey() {
    var key = $("#privatepass").val();
    if (key.substring(0, 2) !== '0x') {
        key = '0x' + key;
    }
    if (key != '' && key.match(/^(0x)?[0-9A-fa-f]{64}$/)) {
        HideButtons();
        try {
            myWallet = new Wallet(key);
            console.log("Opened: " + myWallet.address)
        } catch (e) {
            console.error(e);
        }
        SuccessAccess();
        updateBalance();
    } else {
      $("#privatekeyerror").show();
    }
}


function OpenNewWallet() {
    var pass = $("#newpass").val();
    var passconf = $("#newpassconf").val();
}



function updateBalance() {
    var address = myWallet.address;
    $(".myaddress").html(address);

    provider.getBalance(address).then(function(balance) {
        var etherString = ethers.utils.formatEther(balance);
        console.log("ETH Balance: " + etherString);
        var n = parseFloat(etherString);
        var ethValue = Number.parseFloat(n).toFixed(8);
        var messageEl = $('#ethbal');
        var split = ethValue.split(".");
        ethBalance = parseFloat(ethValue);
        messageEl.html(split[0] + ".<small>" + split[1] + "</small>");
    });

    var callPromise = tokenContract.functions.balanceOf(address);

    callPromise.then(function(result) {
        var trueBal = result[0].toString(10);
        var messageEl = $('#lgrbalance');
        var n = trueBal * 0.00000001;
        console.log("LGR Balance: " + n);
        var atyxValue =  Number.parseFloat(n).toFixed(8);

        var split = atyxValue.split(".");
        tokenBalance = parseFloat(atyxValue);
        $(".storjspend").html(atyxValue)
        messageEl.html(split[0] + ".<small>" + split[1] + "</small>");

    });

}



var keyFile;

function OpenKeystoreFile() {
    dialog.showOpenDialog(function(fileNames) {
        if (fileNames === undefined) return;
        keyFile = fileNames[0];
        console.log(keyFile);
    });
}


function SuccessAccess() {
    $(".options").hide();
    $(".walletInput").hide();
    $("#addressArea").attr("class", "row");
    $("#walletActions").attr("class", "row");
    $(".walletInfo").attr("class", "row walletInfo");
}


function GetEthGas() {
    var price = $("#ethgasprice").val();
    var gaslimit = 21000;
    var txfee = price * gaslimit;
    $("#ethtxfee").val((txfee * 0.000000001).toFixed(5));
    UpdateAvailableETH();
    return false;
}


function GetTokenGas() {
    var price = $("#tokengasprice").val();
    var gaslimit = 65000;
    var txfee = price * gaslimit;
    $("#tokentxfee").val((txfee * 0.000000001).toFixed(5));
    UpdateTokenFeeETH();
    return false;
}


function UnlockWalletKeystore() {
    var password = $("#keystorewalletpass").val();
    var buffer = fs.readFileSync(keyFile);
    var walletData = buffer.toString();
    $("#keystorebtn").html("Decrypting...");
    $("#keystorebtn").prop("disabled", true);

    if (password!='' && keyFile!='' && Wallet.isEncryptedWallet(walletData)){

        Wallet.fromEncryptedWallet(walletData, password).then(function(wallet) {
                console.log("Opened Address: " + wallet.address);
                wallet.provider = new ethers.providers.getDefaultProvider(false);
                myWallet = wallet;
                SuccessAccess();
                updateBalance();
                $("#keystorebtn").html("Decrypting...");
        });
      } else {
        $("#keystorejsonerror").html("Invalid Keystore JSON File")
        $("#keystorejsonerror").show();
        $("#keystorebtn").prop("disabled", false);
        $("#keystorebtn").html("Open");
      }
}

function reject() {
  $("#keystorejsonerror").html("Incorrect Password for Keystore Wallet")
  $("#keystorejsonerror").show();
  $("#keystorebtn").prop("disabled", false);
  $("#keystorebtn").html("Open");
}


function ConfirmButton(elem) {
    $(elem).html("CONFIRM")
    $(elem).attr("class", "btn btn-success")
}



var lastTranx;

function SendEthereum(callback) {
    var to = $('#send_ether_to').val();
    var amount = $('#send_ether_amount').val();
    $("#sendethbutton").prop("disabled", true);
    var price = parseInt($("#ethgasprice").val()) * 1000000000;

    if (to != '' && amount != '' && parseFloat(amount) <= ethBalance) {
        myWallet.provider = new ethers.providers.getDefaultProvider(false);
        var amountWei = ethers.utils.parseEther(amount);
        var targetAddress = ethers.utils.getAddress(to);

        myWallet.send(targetAddress, amountWei, {
            gasPrice: price,
            gasLimit: 21000,
        }).then(function(txid) {
            console.log(txid);
            $("#sendethbutton").prop("disabled", false);
            $('#ethermodal').modal('hide');
            $(".txidLink").html(txid.hash);
            $(".txidLink").attr("onclick", "OpenEtherScan('"+txid.hash+"')");
            $("#senttxamount").html(amount);
            $("#txtoaddress").html(to);
            $("#txtype").html("ETH");
            $('#trxsentModal').modal('show');
            updateBalance();
        });
    }
}



function UpdateAvailableETH() {
    var fee = $("#ethtxfee").val();
    var available = ethBalance - fee;
    $(".ethspend").html(available.toFixed(6));
}


function UpdateTokenFeeETH() {
    var fee = $("#tokentxfee").val();
    var available = ethBalance - fee;
    $(".ethavailable").each(function(){
      $(this).html(available.toFixed(6));
    });
}



function SendToken(callback) {
    var to = $('#send_to_token').val();
    var amount = $('#send_amount_token').val();
    $("#sendtokenbutton").prop("disabled", true);
    var price = parseInt($("#tokengasprice").val()) * 1000000000;

    if (to != '' && amount != '' && parseFloat(amount) <= tokenBalance) {
        myWallet.provider = new ethers.providers.getDefaultProvider(false);
        tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, myWallet);
        tokenContract.transfer(to, (parseFloat(amount) * 100000000), {
            gasPrice: price,
            gasLimit: 65000,
        }).then(function(txid) {
            console.log(txid);
            $('#storjmodal').modal('hide')
            $("#sendtokenbutton").prop("disabled", false);

            $(".txidLink").html(txid.hash);
            $(".txidLink").attr("onclick", "OpenEtherScan('"+txid.hash+"')");
            $("#senttxamount").html(amount);
            $("#txtoaddress").html(to);
            $("#txtype").html("LGR");
            $('#trxsentModal').modal('show');
            updateBalance();
        });
    }
}
