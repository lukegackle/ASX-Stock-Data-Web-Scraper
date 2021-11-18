/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.helloWorld = async (req, res) => {
  let rp = require("request-promise").defaults({ jar: true });
  var cheerio = require("cheerio"); // Basically jQuery for node.js

  var coinsString = req.query.coins;
  var coins = coinsString.split(",");
  var rates = "";

  const ETFStocks = new Set(['A200','ILC','INIF','IOZ','MVW','QOZ','SFY','STW','VAS','VLC','EX20','IMPQ','ISO','KSM','MVE','MVS','SSO','VSO','ATEC','MVB','MVR','OZF','OZR','QFN','QRE','MAAT','IESG','AASF','AUMF','AUST','BBOZ','BEAR','DVDY','E200','EIGA','EINC','FAIR','GEAR','GRNV','HVST','IHD','IIGF','INES','MVOL','RARI','RDV','SELF','SMLL','SWTZ','SYI','VETH','VHY','YMAX','ZYAU','IHOO','IOO','IVE','IWLD','VEU','VGS','WXOZ','ACDC','ASIA','BNKS','CLDD','CLNE','CNEW','CURE','DRUG','ESPO','FANG','FOOD','FUEL','GDX','HACK','HLTH','HNDQ','IXI','IXJ','MNRS','RBTZ','ROBO','TECH','VISM','CRYP','LSGE','FUTR','MHHT','SEMI','HGEN','ADEF','AGX1','BBUS','EMMG','ESGI','ETHI','ERTH','FEMX','GGUS','GOAT','HETH','HQLT','HYGG','IHWL','INCM','LNAS','LPGD','MAET','MGOC','MHG','MKAX','MOAT','MOGL','MSTR','PIXX','QHAL','QLTY','QMIX','QSML','QUAL','SNAS','UMAX','VESG','VGAD','VGMF','VLUE','VMIN','VVLU','WCMQ','WDIV','WRLD','WXHG','ZYUS','QUS','WDMF','WVOL','EMKT','IEM','VGE','WEMG','IAA','PAXX','VAE','CETF','IZZ','ESTX','HEUR','IEU','VEQ','HJPN','IJP','IKO','F100','IHVV','IJH','IJR','IVV','NDQ','SPY','VTS','IIND','NDIA','IFRA','MICH','VBLD','MVA','RINC','SLF','VAP','DJRE','REIT','AUDS','EEU','POU','USD','YANK','VACF','VAF','AGVT','BNDS','BOND','CRED','FLOT','GOVT','HBRD','IAF','ICOR','IGB','ILB','IYLD','PLUS','QPON','RCB','RGB','RSM','SUBD','VGB','XARO','GCAP','EBND','GBND','GGOV','IHCB','IHEB','IHHY','VBND','VCF','VEFI','VIF','AAA','BILL','ISEC','DBBF','DGGF','DHHF','DZZF','GROW','VDBA','VDCO','VDGR','VDHG','ETPMAG','ETPMPD','ETPMPM','ETPMPT','GOLD','OOO','PMGOLD','QAU']);

  var promises = [];

  /*
  DATASTRUCTURE FROM ASX API
	{
	  "code": "QAN",
	  "name_full": "QANTAS AIRWAYS LIMITED",
	  "name_short": "QANTAS",
	  "name_abbrev": "QANTAS AIRWAYS",
	  "principal_activities": "The operation of international and domestic air transportation services, the sale of worldwide and domestic holiday tours and associated support activities including catering, information technology, ground handling and engineering and maintenance.",
	  "industry_group_name": "Transportation",
	  "sector_name": "Industrials",
	  "listing_date": "1995-07-31T00:00:00+1000",
	  "delisting_date": null,
	  "web_address": "http://www.qantas.com",
	  "mailing_address": "10 Bourke Road, MASCOT, NSW, AUSTRALIA, 2020",
	  "phone_number": "(02) 9691 3636",
	  "fax_number": "(02) 9490 1888",
	  "registry_name": "LINK MARKET SERVICES LIMITED",
	  "registry_address": "LEVEL 12, 680 GEORGE STREET, SYDNEY, NSW, AUSTRALIA, 2000",
	  "registry_phone_number": "1300 554 474",
	  "foreign_exempt": false,
	  "investor_relations_url": "http://www.qantas.com.au/travel/airlines/investors/global/en",
	  "fiscal_year_end": "30/06",
	  "logo_image_url": "https://www.asx.com.au/asx/1/image/logo/QAN?image_size=L&v=1478128305000",
	  "primary_share_code": "QAN",
	  "recent_announcement": false,
	  "products": [
		"shares",
		"options",
		"warrants"
	  ],
	  "latest_annual_reports": [
		{
		  "id": "02422906",
		  "document_release_date": "2021-09-17T13:58:43+1000",
		  "document_date": "2021-09-17T13:54:42+1000",
		  "url": "http://www.asx.com.au/asxpdf/20210917/pdf/450lxjzbbkz7bh.pdf",
		  "relative_url": "/asxpdf/20210917/pdf/450lxjzbbkz7bh.pdf",
		  "header": "Qantas 2021 Annual Report",
		  "market_sensitive": false,
		  "number_of_pages": 145,
		  "size": "4.8MB",
		  "legacy_announcement": false
		}
	  ],
	  "primary_share": {
		"code": "QAN",
		"isin_code": "AU000000QAN2",
		"desc_full": "Ordinary Fully Paid",
		"last_price": 5.55,
		"open_price": 5.6,
		"day_high_price": 5.6,
		"day_low_price": 5.55,
		"change_price": -0.06,
		"change_in_percent": "-1.07%",
		"volume": 1500888,
		"bid_price": 5.55,
		"offer_price": 5.56,
		"previous_close_price": 5.61,
		"previous_day_percentage_change": "0.358%",
		"year_high_price": 5.97,
		"last_trade_date": "2021-11-18T00:00:00+1100",
		"year_high_date": "2021-10-22T00:00:00+1100",
		"year_low_price": 4.2,
		"year_low_date": "2021-08-23T00:00:00+1000",
		"year_open_price": 1.235,
		"year_open_date": "2014-02-25T11:00:00+1100",
		"year_change_price": 4.315,
		"year_change_in_percentage": "349.393%",
		"pe": 0,
		"eps": -0.918,
		"average_daily_volume": 8916513,
		"annual_dividend_yield": 0,
		"market_cap": 10580710756,
		"number_of_shares": 1886044698,
		"deprecated_market_cap": 10542990000,
		"deprecated_number_of_shares": 1886044698,
		"suspended": false,
		"indices": [
		  {
			"index_code": "XFL",
			"name_full": "S&P/ASX 50",
			"name_short": "S&P/ASX 50",
			"name_abrev": "S&P/ASX 50"
		  },
		  {
			"index_code": "XTO",
			"name_full": "S&P/ASX 100",
			"name_short": "S&P/ASX100",
			"name_abrev": "S&P/ASX 100"
		  },
		  {
			"index_code": "XJO",
			"name_full": "S&P/ASX 200",
			"name_short": "S&P/ASX200",
			"name_abrev": "S&P/ASX 200"
		  },
		  {
			"index_code": "XKO",
			"name_full": "S&P/ASX 300",
			"name_short": "S&P/ASX300",
			"name_abrev": "S&P/ASX 300"
		  },
		  {
			"index_code": "XAO",
			"name_full": "ALL ORDINARIES",
			"name_short": "ALL ORDS",
			"name_abrev": "All Ordinaries"
		  },
		  {
			"index_code": "XAF",
			"name_full": "S&P/ASX All Australian 50",
			"name_short": "Aust 50",
			"name_abrev": "All Australian 50"
		  },
		  {
			"index_code": "XAT",
			"name_full": "S&P/ASX All Australian 200",
			"name_short": "Aust 200",
			"name_abrev": "All Australian 200"
		  },
		  {
			"index_code": "XNJ",
			"name_full": "S&P/ASX 200 Industrials (Sector)",
			"name_short": "Inds",
			"name_abrev": "Industrials"
		  }
		]
	  }
	}
  */
  var requestASXData = function (ticker, callback) {
    rp(
      "https://www.asx.com.au/asx/1/company/" +
        ticker +
        "?fields=primary_share,latest_annual_reports,last_dividend,primary_share.indices"
    )
      .then(function (response3) {
        var data = [];
        var ASXSum = JSON.parse(response3);
        var SharePrice = "";
        var DivYield = "";
        if (ASXSum.hasOwnProperty("primary_share")) {
          DivYield = ASXSum["primary_share"]["annual_dividend_yield"] / 100;
          SharePrice = ASXSum["primary_share"]["last_price"];
        }
        var Dividend = DivYield * SharePrice;
        var LastFrankedPer = "";
        var PayableDate = "";
        var ExDate = "";
        if (ASXSum.hasOwnProperty("last_dividend")) {
          if (ASXSum["last_dividend"].hasOwnProperty("franked_percentage")) {
            LastFrankedPer = ASXSum["last_dividend"]["franked_percentage"];
          }
          if (ASXSum["last_dividend"].hasOwnProperty("payable_date")) {
            PayableDate = ASXSum["last_dividend"]["payable_date"];
          }
          if (ASXSum["last_dividend"].hasOwnProperty("ex_date")) {
            ExDate = ASXSum["last_dividend"]["ex_date"];
          }
        }

        data.push(Dividend);
        data.push(DivYield);
        data.push(ExDate);
        data.push(LastFrankedPer);
        data.push(PayableDate);
        data.push(SharePrice);
        callback(null, data);
      })
      .catch(function (err) {
        // Crawling failed...
        var data = "";
        console.log("ERROR: Failed loading data for " + ticker);
        console.log(err);
        callback(err, data);
      });
  };

  var requestETFASXData = function (ticker, callback) {
    /*
		DATASTRUCTURE FROM ASX ETF API
		{
		   "data":{
			  "shareInformation":{
				 "priceAsk":18.68,
				 "priceBid":18.6,
				 "priceClose":18.57,
				 "priceDayHigh":18.68,
				 "priceDayLow":18.54,
				 "priceFiftyTwoWeekHigh":18.98,
				 "priceFiftyTwoWeekLow":15.8,
				 "volumeAverage":24591.142857,
				 "nav":17.9058,
				 "shareDescription":"Spdr S&p Global Dividend Fund",
				 "sharesOutstanding":0
			  },
			  "dividends":{
				 "dateExDate":"2021-06-29",
				 "datePayDate":"2021-07-12",
				 "dateRecordDate":"2021-06-30",
				 "dividend":0.4235,
				 "dividendType":"F",
				 "frankingPercent":0.05,
				 "yieldAnnualPercent":0
			  },
			  "fundamentals":{
				 "beta":0.84,
				 "standardDeviation":11.51,
				 "trackingError":8.04,
				 "returnYearToDate":16.11196,
				 "managementFeePercent":0.5
			  }
		   }
		}
	*/

    rp(
      "https://asx.api.markitdigital.com/asx-research/1.0/etfs/" +
        ticker +
        "/key-statistics"
    )
      .then(function (response6) {
        var data = [];
        var ASXSum = JSON.parse(response6);
        var SharePrice = "";
        var DivYield = "";
        var Dividend = "";
        var LastFrankedPer = "";
        var PayableDate = "";
        var ExDate = "";

        if (ASXSum.hasOwnProperty("data")) {
          if (ASXSum["data"].hasOwnProperty("shareInformation")) {
            SharePrice = ASXSum["data"]["shareInformation"]["priceAsk"];
          }
          if (ASXSum["data"].hasOwnProperty("dividends")) {
            DivYield = ASXSum["data"]["dividends"]["yieldAnnualPercent"] / 100;
            Dividend = ASXSum["data"]["dividends"]["dividend"];
            LastFrankedPer =
              ASXSum["data"]["dividends"]["frankingPercent"] / 100;
            PayableDate = ASXSum["data"]["dividends"]["datePayDate"];
            ExDate = ASXSum["data"]["dividends"]["dateExDate"];
          }
        }

        data.push(Dividend);
        data.push(DivYield);
        data.push(ExDate);
        data.push(LastFrankedPer);
        data.push(PayableDate);
        data.push(SharePrice);

        callback(null, data);
      })
      .catch(function (err) {
        var data = "";
        console.log("ERROR: Failed loading data for " + ticker);
        console.log(err);
        callback(err, data);
      });
  };

  var requestYahooData = function (ticker, callback) {
    var Dividend = "";
    var DivYieldPer = "";
    var ExDate = "";
    var LastFrankedPer = "";
    var PayableDate = "";
    var SharePrice = "";

    let YahooData1 = {
      method: "GET",
      uri: "https://au.finance.yahoo.com/quote/" + ticker + ".AX",
      port: 443,
      resolveWithFullResponse: true,
    };

    rp(YahooData1)
      .then(function (response5) {
        var data = [];

        //Get Data
        var $ = cheerio.load(response5.body);

        var table2 = $("#quote-summary > div:nth-child(2) > table > tbody");
        var div = table2.find("tr:nth-child(6)>td:nth-child(2)").text();
        let pselector = $$("#Lead-4-QuoteHeader-Proxy");
        SharePrice = pselector
          .find(
            "#quote-header-info > div:nth-child(3) > div > div > span:nth-child(1)"
          )
          .text();
        if (div.indexOf("%") > -1) {
          div = div.split(" ");
          Dividend = div[0];
          DivYieldPer = div[1];
          DivYieldPer = DivYieldPer.replaceAll("(", "");
          DivYieldPer = DivYieldPer.replaceAll(")", "");
          var parts = table2
            .find("tr:nth-child(7)>td:nth-child(2)>span")
            .text();
          parts = parts.split(" ");
          ExDate =
            parts[0] + "-" + getMonthFromString(parts[1]) + "-" + parts[2];
        } else {
          DivYieldPer = table2
            .find("tr:nth-child(4)>td:nth-child(2)>span")
            .text();
          Dividend = "";
          ExDate = "";
        }

        data.push(Dividend);
        data.push(DivYieldPer);
        data.push(ExDate);
        data.push(LastFrankedPer);
        data.push(PayableDate);
        data.push(SharePrice);

        callback(null, data);
      })
      .catch(function (err) {
        // Crawling failed...
        var data = "";
        console.log("ERROR: Failed loading data for " + ticker);
        console.log(err);
        callback(err, data);
      });
  };

  let getRate = function (ticker) {
    return new Promise(function (resolve, reject) {
      ticker = ticker.trim();
      if (ETFStocks.has(ticker)) {
        console.log(ticker + " is an ETF, load ETF API");
        requestETFASXData(ticker, function (e, data) {
          console.log(ticker + " " + data);
          resolve(
            cleanData(data[0]) +
              "," +
              cleanData(data[1]) +
              "," +
              cleanData(data[2]) +
              "," +
              cleanData(data[3]) +
              "," +
              cleanData(data[4]) +
              "," +
              cleanData(data[5])
          );
        });
      } else {
        requestASXData(ticker, function (e, data) {
          console.log(ticker + " " + data);
          //get stock price:  .quote-header-info div:nthchild(3) div div span
          //let jData = JSON.parse(data);

          if (typeof data[5] === "undefined") {
            //do stuff if query is undefined
            requestYahooData(ticker, function (e, yahooData) {
              console.log(ticker + " " + yahooData);
              resolve(
                cleanData(yahooData[0]) +
                  "," +
                  cleanData(yahooData[1]) +
                  "," +
                  cleanData(yahooData[2]) +
                  "," +
                  cleanData(yahooData[3]) +
                  "," +
                  cleanData(yahooData[4]) +
                  "," +
                  cleanData(yahooData[5])
              );
            });
          } else {
            resolve(
              cleanData(data[0]) +
                "," +
                cleanData(data[1]) +
                "," +
                cleanData(data[2]) +
                "," +
                cleanData(data[3]) +
                "," +
                cleanData(data[4]) +
                "," +
                cleanData(data[5])
            );
          }
        });
      }
    });
  };

  for (let i = 0; i < coins.length; i++) {
    promises.push(getRate(coins[i]));
  }

  Promise.all(promises).then(function (result) {
    for (let i = 0; i < promises.length; i++) {
      let rate = result[i];
      rates = rates + rate + "\n";
    }
    res.status(200).send(rates);
  });

  String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
  };

//Function to clean any characters that could break the output structure.
  var cleanData = function (data) {
    // TO FIX IN LATER VERSION - replaceAll function not found in local context?...
    /*if(data){
      var cleaned = data;
      cleaned = cleaned.replaceAll(',', '');
      cleaned = cleaned.replaceAll('\n', '');
      cleaned = cleaned.replaceAll('\r', '');
      return cleaned;
    }
    else{
      return "";
    }*/
    return data;
  };

  function getMonthFromString(mon) {
    return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1;
  }
};
