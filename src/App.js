import { useState, useMemo, useEffect, useCallback } from "react";

// ─── Firebase REST API (no SDK needed) ───
const FB_URL =
  "https://brand-design-record-default-rtdb.asia-southeast1.firebasedatabase.app";
const FB_ROOT = "bestea-tracker";
const fbGet = async (path) => {
  try {
    const r = await fetch(`${FB_URL}/${FB_ROOT}/${path}.json`);
    return r.ok ? r.json() : null;
  } catch {
    return null;
  }
};
const fbSet = async (path, data) => {
  try {
    await fetch(`${FB_URL}/${FB_ROOT}/${path}.json`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
  } catch {}
};

// ─── Imported historical data from CSV ───
const IMPORTED_DATA = {
  2023: [
    {
      date: "2/17",
      name: "設計＿品牌送禮小卡(12*8)",
      price: "3000",
      qty: "1",
      type: "設計",
    },
    {
      date: "2/17",
      name: "印刷＿店卡",
      price: "1.7",
      qty: "3000",
      type: "印刷",
    },
    {
      date: "3/22",
      name: "印刷＿品牌送禮小卡(12*8)",
      price: "15.5",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "9/19",
      name: "印刷＿品牌茶葉禮盒",
      price: "125.5",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "9/19",
      name: "印刷＿品牌禮盒手提袋25*9*19",
      price: "33.5",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "9/19",
      name: "印刷＿品牌小山吊牌",
      price: "7.5",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "11/16",
      name: "設計＿天天好茶＿茶包系列（12入立袋x5、單入立體茶包袋、20入禮盒、沖泡說明小卡、手提紙袋）",
      price: "150000",
      qty: "1",
      type: "設計",
    },
    {
      date: "12/5",
      name: "設計＿龍年紅包袋",
      price: "10000",
      qty: "1",
      type: "設計",
    },
    {
      date: "12/13",
      name: "印刷＿奪寶電子客製送禮小卡",
      price: "21",
      qty: "250",
      type: "印刷",
    },
    {
      date: "12/14",
      name: "印刷＿龍年紅包袋(9*18)",
      price: "13.5",
      qty: "1500",
      type: "印刷",
    },
    {
      date: "12/27",
      name: "設計＿禮盒專屬小卡延伸設計（品牌10.5*14.8＋暖心7.5*13）",
      price: "5000",
      qty: "2",
      type: "設計",
    },
  ],
  2024: [
    {
      date: "1/18",
      name: "印刷＿暖心禮盒",
      price: "26.5",
      qty: "2000",
      type: "印刷",
    },
    {
      date: "1/19",
      name: "設計＿見面禮卷(9*10.5)",
      price: "5000",
      qty: "1",
      type: "設計",
    },
    {
      date: "2/6",
      name: "印刷＿品牌茶葉禮盒",
      price: "125.5",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "2/6",
      name: "印刷＿品牌禮盒手提袋25*9*19",
      price: "33.5",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "2/6",
      name: "印刷＿品牌小山吊牌",
      price: "7.5",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "2/23",
      name: "印刷＿品牌禮盒小卡(10.5*14.8)",
      price: "4.5",
      qty: "3000",
      type: "印刷",
    },
    {
      date: "2/23",
      name: "印刷＿暖心禮盒小卡(7.5*13)",
      price: "3.5",
      qty: "3000",
      type: "印刷",
    },
    {
      date: "2/23",
      name: "印刷＿見面禮卷(9*10.5)",
      price: "0.6",
      qty: "4000",
      type: "印刷",
    },
    {
      date: "3/8",
      name: "拍攝企劃＿一日商拍＋影片",
      price: "260000",
      qty: "1",
      type: "拍攝",
    },
    {
      date: "4/16",
      name: "設計＿活動贈禮",
      price: "75000",
      qty: "1",
      type: "設計",
    },
    {
      date: "4/16",
      name: "設計＿冷泡茶瓶貼紙",
      price: "22000",
      qty: "1",
      type: "設計",
    },
    {
      date: "5/22",
      name: "印刷＿天天好茶沖泡小卡(18.2*5.4)",
      price: "3",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "5/22",
      name: "印刷＿天天好茶冷泡茶瓶貼紙(5.5*7)",
      price: "1.5",
      qty: "2000",
      type: "印刷",
    },
    {
      date: "5/22",
      name: "印刷＿天天好茶禮盒(18.5*10.7*6.7)",
      price: "26",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "5/22",
      name: "印刷＿天天好茶提袋(21*13.7*9)",
      price: "25.8",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "5/22",
      name: "印刷＿天天好茶12入立袋(13*20*7) 每款各1000",
      price: "16.8",
      qty: "5000",
      type: "印刷",
    },
    {
      date: "5/31",
      name: "設計＿品牌產品DM（品牌＋禮盒／品牌＋茶包／電子版橫式）",
      price: "34000",
      qty: "1",
      type: "設計",
    },
    {
      date: "5/31",
      name: "設計＿天天好茶沖泡小卡(18.2*5.4)",
      price: "5000",
      qty: "1",
      type: "設計",
    },
    {
      date: "6/6",
      name: "設計＿品牌2D公仔",
      price: "72000",
      qty: "1",
      type: "設計",
    },
    {
      date: "6/6",
      name: "印刷＿華南銀行客製吊牌",
      price: "6",
      qty: "200",
      type: "印刷",
    },
    {
      date: "6/14",
      name: "設計＿父親節吊牌",
      price: "5000",
      qty: "1",
      type: "設計",
    },
    {
      date: "6/28",
      name: "設計＿紙提繩手提袋（三種尺寸）",
      price: "16500",
      qty: "1",
      type: "設計",
    },
    {
      date: "7/3",
      name: "拍攝企劃＿二日商拍(天天好茶)",
      price: "150000",
      qty: "1",
      type: "拍攝",
    },
    {
      date: "7/16",
      name: "印刷＿父親節吊牌",
      price: "8",
      qty: "500",
      type: "印刷",
    },
    {
      date: "7/26",
      name: "印刷＿藍色沖泡小卡",
      price: "2.6",
      qty: "3000",
      type: "印刷",
    },
    {
      date: "7/29",
      name: "印刷＿活動視覺＿立體茶盒(10*12*4.5)",
      price: "20",
      qty: "1500",
      type: "印刷",
    },
    {
      date: "7/29",
      name: "印刷＿活動視覺＿茶盒小卡(9*10.5) 三款各500張",
      price: "5",
      qty: "1500",
      type: "印刷",
    },
    {
      date: "8/16",
      name: "印刷＿品牌茶葉禮盒(25.5*22*9.5)",
      price: "123.5",
      qty: "3000",
      type: "印刷",
    },
    {
      date: "8/16",
      name: "印刷＿品牌禮盒人字繩手提袋(25*9*19)",
      price: "32.5",
      qty: "3000",
      type: "印刷",
    },
    {
      date: "8/16",
      name: "印刷＿品牌禮盒小山吊牌(6*2.3)",
      price: "7",
      qty: "3000",
      type: "印刷",
    },
    {
      date: "8/23",
      name: "設計＿蛇年專屬紅包袋",
      price: "16000",
      qty: "1",
      type: "設計",
    },
    {
      date: "8/23",
      name: "設計＿新年禮盒配件",
      price: "12000",
      qty: "1",
      type: "設計",
    },
    {
      date: "8/23",
      name: "設計＿福悠然手提紙袋 25*9*19",
      price: "18000",
      qty: "1",
      type: "設計",
    },
    {
      date: "9/16",
      name: "印刷＿店卡",
      price: "1.7",
      qty: "3000",
      type: "印刷",
    },
    {
      date: "10/1",
      name: "印刷＿大禹嶺茶包外盒(15*10.2*8.2)",
      price: "14",
      qty: "5000",
      type: "印刷",
    },
    {
      date: "10/9",
      name: "設計＿茶具腰封*2+外盒*2",
      price: "68000",
      qty: "1",
      type: "設計",
    },
    {
      date: "10/28",
      name: "印刷＿公版手提袋25*9*19(品牌藍)",
      price: "21.5",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "10/28",
      name: "印刷＿公版手提袋33*11*25(銀)",
      price: "23",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "10/28",
      name: "印刷＿公版手提袋14*11*25(銀)",
      price: "19.5",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "11/15",
      name: "印刷＿蛇年專屬紅包袋10*20",
      price: "24",
      qty: "1800",
      type: "印刷",
    },
    {
      date: "11/15",
      name: "印刷＿新年禮盒配件",
      price: "22.5",
      qty: "500",
      type: "印刷",
    },
    {
      date: "11/15",
      name: "印刷＿福悠然手提紙袋 25*9*19",
      price: "37",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "11/27",
      name: "印刷＿天天好茶系列＿禮盒印刷 18.5*10.7*6.7",
      price: "23.5",
      qty: "2000",
      type: "印刷",
    },
    {
      date: "11/27",
      name: "印刷＿天天好茶提袋 21*13.7*9",
      price: "23",
      qty: "2000",
      type: "印刷",
    },
    {
      date: "11/27",
      name: "印刷＿天天好茶沖泡小卡 18.2*5.4",
      price: "2.8",
      qty: "2000",
      type: "印刷",
    },
  ],
  2025: [
    {
      date: "1/13",
      name: "印刷_暖心一入提袋 (21*12*19.5)",
      price: "22.5",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "2/5",
      name: "印刷_山嵐提袋(21*17.5*12)",
      price: "25",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "2/5",
      name: "印刷_新年禮盒配件",
      price: "18.5",
      qty: "2000",
      type: "印刷",
    },
    {
      date: "2/5",
      name: "印刷_不倒翁茶杯_外盒(15.1*7*4.9)",
      price: "21.07",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "2/5",
      name: "印刷_濾茶器_外盒(10*8.8*5.1)",
      price: "26.66",
      qty: "500",
      type: "印刷",
    },
    {
      date: "2/5",
      name: "印刷_茶海_腰封(4.5*45.5)",
      price: "22",
      qty: "600",
      type: "印刷",
    },
    {
      date: "2/5",
      name: "印刷_評鑑杯組_腰封(4.5*33.5)",
      price: "23.5",
      qty: "500",
      type: "印刷",
    },
    {
      date: "2/7",
      name: "設計_店面視覺規劃",
      price: "60000",
      qty: "1",
      type: "設計",
    },
    {
      date: "2/18",
      name: "製作_凱樂_大禹嶺束口袋",
      price: "42",
      qty: "1000",
      type: "製作",
    },
    {
      date: "3/10",
      name: "印刷_福壽山茶包外盒",
      price: "40.5",
      qty: "2000",
      type: "印刷",
    },
    {
      date: "3/25",
      name: "印刷_茶包款DM(29*13.5)",
      price: "5",
      qty: "500",
      type: "印刷",
    },
    {
      date: "3/25",
      name: "印刷_禮盒款DM(29*13.5)",
      price: "5",
      qty: "500",
      type: "印刷",
    },
    {
      date: "3/31",
      name: "印刷_12K橫式信封(23*12)",
      price: "3",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "3/31",
      name: "印刷_4K直式信封(25*33)",
      price: "6.5",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "3/31",
      name: "印刷_天天好茶小卡(新版、立袋)(7.5*13)",
      price: "3.9",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "4/18",
      name: "設計_中秋氛圍_内坎式包裝視覺設計（盒蓋+內襯+底盒+提袋）",
      price: "70000",
      qty: "1",
      type: "設計",
    },
    {
      date: "4/18",
      name: "設計_過年氛圍_上蓋式包裝視覺設計（盒蓋+內襯+底盒+提袋+紅茶盒）",
      price: "85000",
      qty: "1",
      type: "設計",
    },
    {
      date: "5/9",
      name: "設計_福悠然禮盒延伸小卡 10.5*14.8",
      price: "5000",
      qty: "1",
      type: "設計",
    },
    {
      date: "5/15",
      name: "印刷_【新版】見面禮券 7.25*13.50",
      price: "0.6",
      qty: "4000",
      type: "印刷",
    },
    {
      date: "5/26",
      name: "印刷_焙烏龍茶包外盒 15*10.2*8.2",
      price: "18.5",
      qty: "2000",
      type: "印刷",
    },
    {
      date: "5/27",
      name: "設計_節慶小卡_新年 x 端午 x 中秋（每年沿用 10.5*14.8cm）",
      price: "20000",
      qty: "1",
      type: "設計",
    },
    {
      date: "5/28",
      name: "印刷＿福悠然禮盒小卡(10.5*14.8)",
      price: "5.5",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "6/11",
      name: "印刷_店卡 (9*5.4)",
      price: "1.6",
      qty: "5000",
      type: "印刷",
    },
    {
      date: "6/11",
      name: "印刷_藍色沖泡小卡 (18.2*5.4)",
      price: "2.6",
      qty: "3000",
      type: "印刷",
    },
    {
      date: "6/26",
      name: "印刷_暖心一入提袋 (21*12*19.5)",
      price: "22.5",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "6/30",
      name: "品牌茶罐(綠)",
      price: "23.5",
      qty: "7500",
      type: "製作",
    },
    {
      date: "6/30",
      name: "品牌茶罐(藍)",
      price: "23.5",
      qty: "6000",
      type: "製作",
    },
    {
      date: "6/30",
      name: "品牌茶罐(紅)",
      price: "23.5",
      qty: "4500",
      type: "製作",
    },
    {
      date: "7/16",
      name: "印刷_節慶小卡_新年 x 端午 x 中秋（三款各1000）",
      price: "4.5",
      qty: "3000",
      type: "印刷",
    },
    {
      date: "7/23",
      name: "印刷_暖心禮盒(17.5*8.8*15)",
      price: "26.5",
      qty: "2000",
      type: "印刷",
    },
    {
      date: "7/23",
      name: "印刷_華崗紅茶30入裝茶包外盒",
      price: "18.5",
      qty: "2000",
      type: "印刷",
    },
    {
      date: "7/23",
      name: "設計_馬年紅包袋 10*20cm",
      price: "15000",
      qty: "1",
      type: "設計",
    },
    {
      date: "8/28",
      name: "印刷_拾光茶信_中秋禮盒(上蓋+內襯+底盒)",
      price: "67",
      qty: "1500",
      type: "印刷",
    },
    {
      date: "8/28",
      name: "印刷_拾光茶信_中秋禮盒提袋",
      price: "34",
      qty: "1500",
      type: "印刷",
    },
    {
      date: "9/11",
      name: "紙箱設計_品牌形象視覺版(白墨) 20X10X10/23X14X13/25X20X15",
      price: "18000",
      qty: "1",
      type: "設計",
    },
    {
      date: "9/11",
      name: "紙箱設計_公仔設計視覺版(彩色) 30X30X15",
      price: "18000",
      qty: "1",
      type: "設計",
    },
    {
      date: "9/22",
      name: "印刷_中秋禮盒小卡 7.5*13cm",
      price: "3.5",
      qty: "1500",
      type: "印刷",
    },
    {
      date: "9/22",
      name: "印刷_過年禮盒小卡 7.5*13cm",
      price: "3.5",
      qty: "1500",
      type: "印刷",
    },
    {
      date: "9/23",
      name: "印刷_天天好茶12入立袋(13*20*7)",
      price: "16.8",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "9/25",
      name: "印刷_名片印刷 9*5.4（細波紙 4人*250張）",
      price: "2.5",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "9/25",
      name: "印刷_朝霞映春_過年禮盒(上蓋+水晶貼+內襯+底盒)",
      price: "80.5",
      qty: "1500",
      type: "印刷",
    },
    {
      date: "9/25",
      name: "印刷_朝霞映春_過年提袋 27.4*27.5",
      price: "26.5",
      qty: "1500",
      type: "印刷",
    },
    {
      date: "9/25",
      name: "印刷_朝霞映春_紅茶外盒 8*6.7*20",
      price: "17.5",
      qty: "1500",
      type: "印刷",
    },
    {
      date: "9/25",
      name: "製作_紅茶外盒_品名標籤貼（紅玉、梨紅、白茶各1000）",
      price: "0.5",
      qty: "3000",
      type: "製作",
    },
    {
      date: "9/30",
      name: "拍攝企劃＿一日商拍(茶信+朝霞)",
      price: "80000",
      qty: "1",
      type: "拍攝",
    },
    {
      date: "10/14",
      name: "印刷_紙箱一般盒 30*30*15 (彩色) 白灰銅",
      price: "29.5",
      qty: "1500",
      type: "印刷",
    },
    {
      date: "10/16",
      name: "印刷_天天好茶小卡 7.5 x 13 cm",
      price: "3.5",
      qty: "1500",
      type: "印刷",
    },
    {
      date: "10/16",
      name: "印刷_新版_品牌禮盒內襯",
      price: "17.5",
      qty: "1000",
      type: "印刷",
    },
    {
      date: "10/16",
      name: "印刷_馬年紅包袋",
      price: "14.5",
      qty: "1500",
      type: "印刷",
    },
    {
      date: "12/11",
      name: "印刷＿活動視覺＿立體茶盒(10*12*4.5)",
      price: "20",
      qty: "1500",
      type: "印刷",
    },
    {
      date: "12/12",
      name: "印刷_東格＿活動視覺＿茶盒小卡_三款(9*10.5)",
      price: "2.75",
      qty: "1500",
      type: "印刷",
    },
    {
      date: "12/30",
      name: "設計_一葉和璞_包裝視覺設計（盒蓋+內襯+提袋+小卡+綠色系茶盒+品項貼）",
      price: "88000",
      qty: "1",
      type: "設計",
    },
  ],
  2026: [
    {
      date: "1/6",
      name: "製作_凱樂_束口袋（華崗紅茶500+焙烏龍500）",
      price: "45",
      qty: "1000",
      type: "製作",
    },
    {
      date: "1/23",
      name: "印刷_東格(喵製)_三折沖泡說明 A4雙銅100P+雙面彩印 21*14cm",
      price: "0.425",
      qty: "2000",
      type: "印刷",
    },
    {
      date: "1/29",
      name: "印刷_印時代(喵製)_官網出貨卡 220p水彩紙-雙面彩印 8*12cm",
      price: "1.8",
      qty: "2000",
      type: "印刷",
    },
    {
      date: "1/29",
      name: "印刷＿品牌茶葉禮盒(25.5*22*9.5)",
      price: "131.5",
      qty: "2000",
      type: "印刷",
    },
    {
      date: "1/29",
      name: "印刷＿品牌禮盒小山吊牌(6*2.3)",
      price: "8",
      qty: "2000",
      type: "印刷",
    },
    {
      date: "1/29",
      name: "印刷＿福悠然手提紙袋 25*9*19",
      price: "34",
      qty: "1500",
      type: "印刷",
    },
    {
      date: "2/2",
      name: "印刷_東格_見面禮券 7.25*13.5 雙銅紙150P",
      price: "0.3",
      qty: "4000",
      type: "印刷",
    },
    {
      date: "3/2",
      name: "(淘)優色_12絲挖口塑膠袋_28*28*12_藍logo",
      price: "2.71",
      qty: "1000",
      type: "製作",
    },
    {
      date: "3/2",
      name: "印刷_東格(喵製)_常態小卡_囍字 象牙220P 9*10.5",
      price: "3.25",
      qty: "100",
      type: "印刷",
    },
  ],
};

const NEW_PRODUCTS_DATA = {
  2023: [],
  2024: [],
  2025: [],
  2026: [],
};

// ─── Helpers ───
const YEARS = ["2023", "2024", "2025", "2026"];
const TYPE_C = {
  印刷: { bg: "#E8F4F8", text: "#1B6B8A", dot: "#2BA0C7" },
  設計: { bg: "#FFF3E6", text: "#A0612B", dot: "#E8912D" },
  製作: { bg: "#EDE9FE", text: "#6D28D9", dot: "#8B5CF6" },
  拍攝: { bg: "#FCE7F3", text: "#9D174D", dot: "#EC4899" },
  採購: { bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
};
const CAT_C = {
  茶品: { bg: "#ECFDF5", text: "#065F46", dot: "#10B981", icon: "🍃" },
  禮盒: { bg: "#FFF3E6", text: "#A0612B", dot: "#E8912D", icon: "🎁" },
  配件: { bg: "#E8F4F8", text: "#1B6B8A", dot: "#2BA0C7", icon: "🏷️" },
  茶具: { bg: "#EDE9FE", text: "#6D28D9", dot: "#8B5CF6", icon: "🫖" },
  節慶: { bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444", icon: "🧧" },
  行銷: { bg: "#FCE7F3", text: "#9D174D", dot: "#EC4899", icon: "📣" },
  品牌: { bg: "#FEF9C3", text: "#854D0E", dot: "#EAB308", icon: "⭐" },
};

// Display order for design/procurement groups
const TYPE_ORDER = ["設計", "製作", "印刷", "拍攝", "採購"];
const CAT_ORDER = ["茶品", "禮盒", "配件", "茶具", "節慶", "行銷", "品牌"];

const TYPE_LABELS = {
  設計: { icon: "🎨", label: "設計" },
  製作: { icon: "🔧", label: "製作" },
  印刷: { icon: "🖨️", label: "印刷" },
  拍攝: { icon: "📸", label: "拍攝" },
  採購: { icon: "🛒", label: "採購" },
};
const CAT_LABELS = {
  茶品: { icon: "🍃", label: "茶品" },
  禮盒: { icon: "🎁", label: "禮盒" },
  配件: { icon: "🏷️", label: "配件" },
  茶具: { icon: "🫖", label: "茶具" },
  節慶: { icon: "🧧", label: "節慶" },
  行銷: { icon: "📣", label: "行銷" },
  品牌: { icon: "⭐", label: "品牌" },
};

const SK = "bestea-tracker-v3";
const SK_NP = "bestea-np-v3";
const gid = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
const fmt = (n) => {
  if (!n || isNaN(Number(n))) return "-";
  const v = Number(n);
  return v >= 1 ? `$${v.toLocaleString()}` : `$${v}`;
};
const tot = (p, q) => {
  const a = Number(p),
    b = Number(q);
  return a && b ? `$${(a * b).toLocaleString()}` : "-";
};
const pd = (d) => {
  if (!d) return -1;
  const p = d.split("/");
  return (parseInt(p[0]) || 0) * 100 + (parseInt(p[1]) || 0);
};

export default function App() {
  const [sec, setSec] = useState("設計採購");
  const [tab, setTab] = useState("2026");
  const [items] = useState(() => {
    const b = {};
    YEARS.forEach((y) => {
      b[y] = (IMPORTED_DATA[y] || []).map((d, i) => ({
        ...d,
        id: `i-${y}-${i}`,
        source: "imported",
      }));
    });
    return b;
  });
  const [npBase, setNpBase] = useState(() => {
    const b = {};
    YEARS.forEach((y) => {
      b[y] = (NEW_PRODUCTS_DATA[y] || []).map((d, i) => ({
        ...d,
        id: `np-${y}-${i}`,
        source: "imported",
      }));
    });
    return b;
  });
  const [ui, setUi] = useState({});
  const [unp, setUnp] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("全部");
  const [editId, setEditId] = useState(null);
  const [fd, setFd] = useState({});
  const [delC, setDelC] = useState(null);
  const [synced, setSynced] = useState(false);

  // ─── Load: try Firebase first, fallback to window.storage ───
  // NEW_PRODUCTS_DATA has been cleared; also clear remote npBase.
  // User-added new products (unp) are still synced.
  useEffect(() => {
    (async () => {
      let loaded = false;
      try {
        const fbUi = await fbGet("ui");
        // Clear ALL new product data from Firebase (npBase + unp)
        await Promise.all([fbSet("npBase", null), fbSet("unp", null)]);
        if (fbUi !== null) {
          setUi(fbUi);
          loaded = true;
          setSynced(true);
          setTimeout(() => setSynced(false), 1500);
        }
      } catch {}
      if (!loaded) {
        try {
          const r = await window.storage.get(SK);
          if (r) setUi(JSON.parse(r.value));
        } catch {}
      }
      // Clear all new product data from window.storage
      try {
        await window.storage.delete(SK_NP);
      } catch {}
      try {
        await window.storage.delete(SK_NP + "-base");
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const iv = setInterval(async () => {
      try {
        const fbUi = await fbGet("ui");
        if (fbUi !== null) setUi(fbUi);
        setSynced(true);
        setTimeout(() => setSynced(false), 1200);
      } catch {}
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  const saveUi = async (d) => {
    setUi(d);
    try {
      await window.storage.set(SK, JSON.stringify(d));
    } catch {}
    fbSet("ui", d);
  };
  const saveUnp = async (d) => {
    setUnp(d);
    try {
      await window.storage.set(SK_NP, JSON.stringify(d));
    } catch {}
    fbSet("unp", d);
  };
  const saveNpBase = async (d) => {
    setNpBase(d);
    try {
      await window.storage.set(SK_NP + "-base", JSON.stringify(d));
    } catch {}
    fbSet("npBase", d);
  };

  const isDT = sec === "設計採購";

  // Build flat list (filtered + searched), then group
  const curDesign = useMemo(() => {
    let all = [
      ...(items[tab] || []),
      ...(ui[tab] || []).map((d) => ({ ...d, source: "user" })),
    ];
    if (filter !== "全部") all = all.filter((d) => d.type === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      all = all.filter((d) => d.name.toLowerCase().includes(q));
    }
    all.sort((a, b) => pd(b.date) - pd(a.date));
    return all;
  }, [items, ui, tab, filter, search]);

  const curNp = useMemo(() => {
    let all = [
      ...(npBase[tab] || []),
      ...(unp[tab] || []).map((d) => ({ ...d, source: "user" })),
    ];
    if (filter !== "全部") all = all.filter((d) => d.category === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      all = all.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.desc || "").toLowerCase().includes(q)
      );
    }
    all.sort((a, b) => pd(b.date) - pd(a.date));
    return all;
  }, [npBase, unp, tab, filter, search]);

  // ─── Grouped data for rendering ───
  const groupedDesign = useMemo(() => {
    const groups = {};
    curDesign.forEach((item) => {
      const key = item.type || "其他";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    // Return ordered array of [type, items[]]
    return TYPE_ORDER.filter((t) => groups[t]).map((t) => [t, groups[t]]);
  }, [curDesign]);

  const groupedNp = useMemo(() => {
    const groups = {};
    curNp.forEach((item) => {
      const key = item.category || "其他";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return CAT_ORDER.filter((c) => groups[c]).map((c) => [c, groups[c]]);
  }, [curNp]);

  const dStats = useMemo(() => {
    const all = [...(items[tab] || []), ...(ui[tab] || [])];
    const t = {};
    let cost = 0;
    all.forEach((d) => {
      t[d.type] = (t[d.type] || 0) + 1;
      const p = Number(d.price),
        q = Number(d.qty);
      if (p && q) cost += q === 1 && p > 1000 ? p : p * q;
    });
    return { n: all.length, t, cost };
  }, [items, ui, tab]);
  const nStats = useMemo(() => {
    const all = [...(npBase[tab] || []), ...(unp[tab] || [])];
    const c = {};
    all.forEach((d) => {
      c[d.category] = (c[d.category] || 0) + 1;
    });
    return { n: all.length, c };
  }, [npBase, unp, tab]);

  const reset = () => {
    setFd({});
    setShowForm(false);
    setEditId(null);
  };
  const submit = () => {
    if (!fd.name?.trim()) return;
    const item = { ...fd, id: editId || gid() };
    if (isDT) {
      const arr = [...(ui[tab] || [])];
      if (editId) {
        const i = arr.findIndex((d) => d.id === editId);
        if (i >= 0) arr[i] = item;
      } else arr.push(item);
      saveUi({ ...ui, [tab]: arr });
    } else {
      const isImported =
        editId && (npBase[tab] || []).some((d) => d.id === editId);
      if (isImported) {
        const updated = {
          ...npBase,
          [tab]: (npBase[tab] || []).map((d) =>
            d.id === editId ? { ...item, source: "imported" } : d
          ),
        };
        saveNpBase(updated);
      } else {
        const arr = [...(unp[tab] || [])];
        if (editId) {
          const i = arr.findIndex((d) => d.id === editId);
          if (i >= 0) arr[i] = item;
        } else arr.push(item);
        saveUnp({ ...unp, [tab]: arr });
      }
    }
    reset();
  };
  const edit = (item) => {
    if (isDT && item.source === "imported") return;
    setFd({ ...item });
    setEditId(item.id);
    setShowForm(true);
  };
  const del = (item) => {
    if (isDT) {
      if (item.source === "imported") return;
      saveUi({
        ...ui,
        [tab]: (ui[tab] || []).filter((d) => d.id !== item.id),
      });
    } else {
      if (item.source === "imported") {
        const updated = {
          ...npBase,
          [tab]: (npBase[tab] || []).filter((d) => d.id !== item.id),
        };
        saveNpBase(updated);
      } else {
        saveUnp({
          ...unp,
          [tab]: (unp[tab] || []).filter((d) => d.id !== item.id),
        });
      }
    }
    setDelC(null);
  };

  const fOpts = isDT
    ? ["全部", "印刷", "設計", "製作", "拍攝", "採購"]
    : ["全部", "茶品", "禮盒", "配件", "茶具", "節慶", "行銷", "品牌"];

  const grouped = isDT ? groupedDesign : groupedNp;
  const totalItems = isDT ? curDesign.length : curNp.length;

  // ─── Compute subtotal per group (design mode only) ───
  const groupSubtotal = useCallback((groupItems) => {
    let sum = 0;
    groupItems.forEach((d) => {
      const p = Number(d.price),
        q = Number(d.qty);
      if (p && q) sum += q === 1 && p > 1000 ? p : p * q;
    });
    return sum;
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(145deg, #f8f6f3 0%, #f0ece6 50%, #e8e4dd 100%)",
        fontFamily: "'Noto Sans TC', -apple-system, sans-serif",
        color: "#2D2A26",
      }}
    >
      {/* Sync indicator */}
      <div
        style={{
          position: "fixed",
          top: 12,
          right: 12,
          zIndex: 99,
          padding: "5px 12px",
          borderRadius: 20,
          fontSize: 11,
          background: synced ? "#10B981" : "rgba(0,0,0,0.4)",
          color: "#fff",
          transition: "all 0.3s",
          opacity: synced ? 1 : 0.6,
        }}
      >
        {synced ? "🔄 已同步" : "● 即時連線中"}
      </div>

      <div
        style={{
          background: isDT
            ? "linear-gradient(135deg, #1a3a4a 0%, #2d5a6b 60%, #1B6B8A 100%)"
            : "linear-gradient(135deg, #3a2a1a 0%, #6b4a2d 60%, #8A5B1B 100%)",
          padding: "22px 24px 0",
          position: "relative",
          overflow: "hidden",
          transition: "background 0.4s",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 50%)",
          }}
        />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 3,
            }}
          >
            <span style={{ fontSize: 18 }}>🍵</span>
            <span
              style={{
                fontSize: 10,
                letterSpacing: 3,
                color: "rgba(255,255,255,0.5)",
                fontWeight: 500,
              }}
            >
              BESTEA 天下第一好茶
            </span>
          </div>
          <h1
            style={{
              fontSize: 21,
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 14px",
            }}
          >
            {isDT ? "品牌設計採購紀錄" : "品牌新品上架紀錄"}
          </h1>
          <div style={{ display: "flex", gap: 0 }}>
            {["設計採購", "新品上架"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSec(s);
                  setFilter("全部");
                  setSearch("");
                  setShowForm(false);
                }}
                style={{
                  padding: "11px 22px",
                  border: "none",
                  borderRadius: "9px 9px 0 0",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: sec === s ? 700 : 500,
                  background: sec === s ? "#f8f6f3" : "rgba(255,255,255,0.08)",
                  color: sec === s ? "#2D2A26" : "rgba(255,255,255,0.6)",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                }}
              >
                {s === "設計採購" ? "📋 設計採購" : "🚀 新品上架"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
        <div
          style={{
            display: "flex",
            gap: 4,
            padding: "14px 0 10px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            overflowX: "auto",
          }}
        >
          {YEARS.map((y) => {
            const active = tab === y;
            const cnt = isDT
              ? (items[y] || []).length + (ui[y] || []).length
              : (npBase[y] || []).length + (unp[y] || []).length;
            return (
              <button
                key={y}
                onClick={() => setTab(y)}
                style={{
                  padding: "9px 18px",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: active ? 700 : 500,
                  background: active
                    ? isDT
                      ? "linear-gradient(135deg, #1B6B8A, #2BA0C7)"
                      : "linear-gradient(135deg, #8A5B1B, #C7922B)"
                    : "transparent",
                  color: active ? "#fff" : "#8A8580",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  whiteSpace: "nowrap",
                  fontFamily: "inherit",
                }}
              >
                {y}
                <span
                  style={{
                    fontSize: 10,
                    padding: "2px 6px",
                    borderRadius: 9,
                    background: active
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(0,0,0,0.05)",
                    color: active ? "#fff" : "#aaa",
                  }}
                >
                  {cnt}
                </span>
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "12px 0",
            overflowX: "auto",
            flexWrap: "wrap",
          }}
        >
          {isDT ? (
            <>
              {Object.entries(dStats.t).map(([k, v]) => {
                const c = TYPE_C[k] || TYPE_C["印刷"];
                return (
                  <div
                    key={k}
                    style={{
                      padding: "7px 12px",
                      borderRadius: 7,
                      background: c.bg,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: c.dot,
                      }}
                    />
                    <span
                      style={{ fontSize: 11, color: c.text, fontWeight: 600 }}
                    >
                      {k}
                    </span>
                    <span style={{ fontSize: 11, color: c.text, opacity: 0.7 }}>
                      {v}
                    </span>
                  </div>
                );
              })}
              <div
                style={{
                  padding: "7px 12px",
                  borderRadius: 7,
                  background: "#f5f5f0",
                  marginLeft: "auto",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ fontSize: 10, color: "#999" }}>年度估算 </span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>
                  ${dStats.cost.toLocaleString()}
                </span>
              </div>
            </>
          ) : (
            <>
              {Object.entries(nStats.c).map(([k, v]) => {
                const c = CAT_C[k] || CAT_C["茶品"];
                return (
                  <div
                    key={k}
                    style={{
                      padding: "7px 12px",
                      borderRadius: 7,
                      background: c.bg,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span style={{ fontSize: 12 }}>{c.icon}</span>
                    <span
                      style={{ fontSize: 11, color: c.text, fontWeight: 600 }}
                    >
                      {k}
                    </span>
                    <span style={{ fontSize: 11, color: c.text, opacity: 0.7 }}>
                      {v}
                    </span>
                  </div>
                );
              })}
              <div
                style={{
                  padding: "7px 12px",
                  borderRadius: 7,
                  background: "#f5f5f0",
                  marginLeft: "auto",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ fontSize: 10, color: "#999" }}>年度新品 </span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>
                  {nStats.n} 項
                </span>
              </div>
            </>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: 7,
            padding: "4px 0 12px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, minWidth: 160, position: "relative" }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isDT ? "搜尋品項..." : "搜尋新品..."}
              style={{
                width: "100%",
                padding: "8px 12px 8px 32px",
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.08)",
                background: "#fff",
                fontSize: 12,
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 13,
                opacity: 0.3,
              }}
            >
              🔍
            </span>
          </div>
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {fOpts.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                style={{
                  padding: "6px 10px",
                  border: "1px solid",
                  borderColor:
                    filter === t
                      ? isDT
                        ? "#1B6B8A"
                        : "#8A5B1B"
                      : "rgba(0,0,0,0.08)",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: filter === t ? 600 : 400,
                  background:
                    filter === t ? (isDT ? "#1B6B8A" : "#8A5B1B") : "#fff",
                  color: filter === t ? "#fff" : "#888",
                  fontFamily: "inherit",
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setFd(
                isDT
                  ? {
                      date: "",
                      name: "",
                      price: "",
                      qty: "",
                      type: "印刷",
                      note: "",
                    }
                  : { date: "", name: "", category: "茶品", desc: "" }
              );
              setEditId(null);
              setShowForm(true);
            }}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              background: isDT
                ? "linear-gradient(135deg, #E8912D, #D4781F)"
                : "linear-gradient(135deg, #10B981, #059669)",
              color: "#fff",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 4,
              boxShadow: isDT
                ? "0 2px 8px rgba(232,145,45,0.3)"
                : "0 2px 8px rgba(16,185,129,0.3)",
            }}
          >
            <span style={{ fontSize: 15, lineHeight: 1 }}>+</span>
            {isDT ? "新增品項" : "新增新品"}
          </button>
        </div>

        {showForm && (
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 20,
              marginBottom: 12,
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                {editId ? "✏️ 編輯" : "✨ 新增"}
                {isDT ? "品項" : "新品"}
              </h3>
              <button
                onClick={reset}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 17,
                  cursor: "pointer",
                  color: "#aaa",
                }}
              >
                ✕
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: 10,
              }}
            >
              <div>
                <label style={lbl}>日期</label>
                <input
                  type="text"
                  placeholder="例: 3/15"
                  value={fd.date || ""}
                  onChange={(e) => setFd({ ...fd, date: e.target.value })}
                  style={inp}
                />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={lbl}>{isDT ? "品項名稱" : "新品名稱"} *</label>
                <input
                  type="text"
                  placeholder={
                    isDT ? "例: 印刷＿品牌茶葉禮盒" : "例: 朝霞映春_過年禮盒"
                  }
                  value={fd.name || ""}
                  onChange={(e) => setFd({ ...fd, name: e.target.value })}
                  style={inp}
                />
              </div>
              {isDT ? (
                <>
                  <div>
                    <label style={lbl}>類別</label>
                    <select
                      value={fd.type || "印刷"}
                      onChange={(e) => setFd({ ...fd, type: e.target.value })}
                      style={{ ...inp, cursor: "pointer" }}
                    >
                      {["印刷", "設計", "製作", "拍攝", "採購"].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>單價 (NT$)</label>
                    <input
                      type="text"
                      placeholder="26.5"
                      value={fd.price || ""}
                      onChange={(e) => setFd({ ...fd, price: e.target.value })}
                      style={inp}
                    />
                  </div>
                  <div>
                    <label style={lbl}>數量</label>
                    <input
                      type="text"
                      placeholder="1000"
                      value={fd.qty || ""}
                      onChange={(e) => setFd({ ...fd, qty: e.target.value })}
                      style={inp}
                    />
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={lbl}>備註</label>
                    <input
                      type="text"
                      placeholder="選填"
                      value={fd.note || ""}
                      onChange={(e) => setFd({ ...fd, note: e.target.value })}
                      style={inp}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label style={lbl}>分類</label>
                    <select
                      value={fd.category || "茶品"}
                      onChange={(e) =>
                        setFd({ ...fd, category: e.target.value })
                      }
                      style={{ ...inp, cursor: "pointer" }}
                    >
                      {[
                        "茶品",
                        "禮盒",
                        "配件",
                        "茶具",
                        "節慶",
                        "行銷",
                        "品牌",
                      ].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={lbl}>商品描述</label>
                    <input
                      type="text"
                      placeholder="新品規格或說明"
                      value={fd.desc || ""}
                      onChange={(e) => setFd({ ...fd, desc: e.target.value })}
                      style={inp}
                    />
                  </div>
                </>
              )}
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 16,
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={reset}
                style={{
                  padding: "8px 20px",
                  borderRadius: 7,
                  border: "1px solid #ddd",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: "inherit",
                  color: "#888",
                }}
              >
                取消
              </button>
              <button
                onClick={submit}
                style={{
                  padding: "8px 24px",
                  borderRadius: 7,
                  border: "none",
                  background: isDT
                    ? "linear-gradient(135deg, #1B6B8A, #2BA0C7)"
                    : "linear-gradient(135deg, #8A5B1B, #C7922B)",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "inherit",
                  color: "#fff",
                  opacity: fd.name?.trim() ? 1 : 0.5,
                }}
              >
                {editId ? "更新" : "新增"}
              </button>
            </div>
          </div>
        )}

        {/* ─── Grouped List Rendering ─── */}
        <div style={{ paddingBottom: 36 }}>
          {totalItems === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "45px 20px",
                color: "#bbb",
                fontSize: 13,
              }}
            >
              {search || filter !== "全部"
                ? "沒有符合條件的品項"
                : isDT
                ? "尚無品項紀錄"
                : "尚無新品紀錄，點擊「新增新品」開始記錄"}
            </div>
          ) : (
            grouped.map(([groupKey, groupItems]) => {
              const colorSet = isDT
                ? TYPE_C[groupKey] || TYPE_C["印刷"]
                : CAT_C[groupKey] || CAT_C["茶品"];
              const labelInfo = isDT
                ? TYPE_LABELS[groupKey] || { icon: "📦", label: groupKey }
                : CAT_LABELS[groupKey] || { icon: "📦", label: groupKey };

              return (
                <div key={groupKey} style={{ marginBottom: 20 }}>
                  {/* ── Section Header ── */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 0 8px",
                      borderBottom: `2px solid ${colorSet.dot}33`,
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 7,
                        background: colorSet.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                      }}
                    >
                      {labelInfo.icon}
                    </div>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: colorSet.text,
                      }}
                    >
                      {labelInfo.label}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: colorSet.text,
                        opacity: 0.6,
                        fontWeight: 500,
                      }}
                    >
                      {groupItems.length} 項
                    </span>
                    {isDT && (
                      <span
                        style={{
                          marginLeft: "auto",
                          fontSize: 11,
                          color: colorSet.text,
                          fontWeight: 600,
                          opacity: 0.8,
                        }}
                      >
                        小計 ${groupSubtotal(groupItems).toLocaleString()}
                      </span>
                    )}
                  </div>
                  {/* ── Cards Grid ── */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: 6,
                    }}
                  >
                    {groupItems.map((item, idx) => {
                      const isU = item.source === "user";
                      if (isDT) {
                        const c = TYPE_C[item.type] || TYPE_C["印刷"];
                        return (
                          <div
                            key={item.id || idx}
                            style={{
                              background: "#fff",
                              borderRadius: 10,
                              padding: "12px 16px",
                              border: "1px solid rgba(0,0,0,0.04)",
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                              position: "relative",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                            }}
                          >
                            <div
                              style={{
                                padding: "3px 8px",
                                borderRadius: 5,
                                background: c.bg,
                                color: c.text,
                                fontSize: 10,
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                marginTop: 2,
                              }}
                            >
                              {item.type}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  lineHeight: 1.5,
                                  wordBreak: "break-word",
                                }}
                              >
                                {item.name}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  gap: 12,
                                  marginTop: 4,
                                  flexWrap: "wrap",
                                }}
                              >
                                {item.date && (
                                  <span style={ms}>
                                    📅 {tab}/{item.date}
                                  </span>
                                )}
                                {item.price && item.price !== "-" && (
                                  <span style={ms}>💰 {fmt(item.price)}</span>
                                )}
                                {item.qty && item.qty !== "-" && (
                                  <span style={ms}>
                                    📦 {Number(item.qty).toLocaleString()}
                                  </span>
                                )}
                                {item.price && item.qty && (
                                  <span
                                    style={{
                                      fontSize: 11,
                                      color: "#1B6B8A",
                                      fontWeight: 600,
                                    }}
                                  >
                                    小計 {tot(item.price, item.qty)}
                                  </span>
                                )}
                              </div>
                              {item.note && (
                                <div
                                  style={{
                                    fontSize: 10,
                                    color: "#aaa",
                                    marginTop: 3,
                                    fontStyle: "italic",
                                  }}
                                >
                                  📝 {item.note}
                                </div>
                              )}
                            </div>
                            {isU ? (
                              <div
                                style={{
                                  display: "flex",
                                  gap: 4,
                                  flexShrink: 0,
                                }}
                              >
                                <button onClick={() => edit(item)} style={ab}>
                                  ✏️
                                </button>
                                {delC === item.id ? (
                                  <div style={{ display: "flex", gap: 3 }}>
                                    <button
                                      onClick={() => del(item)}
                                      style={{
                                        ...ab,
                                        background: "#FEE2E2",
                                        fontSize: 10,
                                        padding: "3px 6px",
                                      }}
                                    >
                                      確認
                                    </button>
                                    <button
                                      onClick={() => setDelC(null)}
                                      style={{
                                        ...ab,
                                        fontSize: 10,
                                        padding: "3px 6px",
                                      }}
                                    >
                                      取消
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDelC(item.id)}
                                    style={ab}
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div
                                style={{
                                  fontSize: 9,
                                  color: "#ccc",
                                  position: "absolute",
                                  top: 5,
                                  right: 9,
                                }}
                              >
                                已匯入
                              </div>
                            )}
                          </div>
                        );
                      } else {
                        const c = CAT_C[item.category] || CAT_C["茶品"];
                        return (
                          <div
                            key={item.id || idx}
                            style={{
                              background: "#fff",
                              borderRadius: 10,
                              padding: "12px 16px",
                              border: `1px solid ${c.dot}22`,
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                              position: "relative",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                              borderLeft: `3px solid ${c.dot}`,
                            }}
                          >
                            <div
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 9,
                                background: c.bg,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 17,
                                flexShrink: 0,
                              }}
                            >
                              {c.icon}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 7,
                                  flexWrap: "wrap",
                                }}
                              >
                                <span style={{ fontSize: 13, fontWeight: 700 }}>
                                  {item.name}
                                </span>
                                <span
                                  style={{
                                    padding: "2px 7px",
                                    borderRadius: 4,
                                    background: c.bg,
                                    color: c.text,
                                    fontSize: 10,
                                    fontWeight: 600,
                                  }}
                                >
                                  {item.category}
                                </span>
                              </div>
                              {item.desc && (
                                <div
                                  style={{
                                    fontSize: 11,
                                    color: "#888",
                                    marginTop: 3,
                                    lineHeight: 1.5,
                                  }}
                                >
                                  {item.desc}
                                </div>
                              )}
                              {item.date && (
                                <div
                                  style={{
                                    fontSize: 10,
                                    color: "#bbb",
                                    marginTop: 3,
                                  }}
                                >
                                  🗓️ {tab}/{item.date} 上架
                                </div>
                              )}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: 4,
                                flexShrink: 0,
                              }}
                            >
                              <button onClick={() => edit(item)} style={ab}>
                                ✏️
                              </button>
                              {delC === item.id ? (
                                <div style={{ display: "flex", gap: 3 }}>
                                  <button
                                    onClick={() => del(item)}
                                    style={{
                                      ...ab,
                                      background: "#FEE2E2",
                                      fontSize: 10,
                                      padding: "3px 6px",
                                    }}
                                  >
                                    確認
                                  </button>
                                  <button
                                    onClick={() => setDelC(null)}
                                    style={{
                                      ...ab,
                                      fontSize: 10,
                                      padding: "3px 6px",
                                    }}
                                  >
                                    取消
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDelC(item.id)}
                                  style={ab}
                                >
                                  🗑️
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

const lbl = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "#888",
  marginBottom: 4,
};
const inp = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 7,
  border: "1px solid rgba(0,0,0,0.1)",
  fontSize: 12,
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
  background: "#fafaf8",
};
const ab = {
  background: "#f5f5f0",
  border: "none",
  borderRadius: 5,
  padding: "4px 6px",
  cursor: "pointer",
  fontSize: 12,
  lineHeight: 1,
};
const ms = { fontSize: 11, color: "#999" };
