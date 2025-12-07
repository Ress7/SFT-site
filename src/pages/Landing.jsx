import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sparkles, Shield, Lock, CheckCircle, ArrowRight, Key, Crown, XCircle, TrendingUp, BarChart3, Brain, Globe } from "lucide-react";
import { createPageUrl } from "@/utils";
import { useNavigate, Link } from "react-router-dom";
import DecryptedText from "@/components/ui/DecryptedText";
import PixelBlast from "@/components/ui/PixelBlast";
import { supabase } from "@/lib/supabaseClient";

const VALID_INVITE_CODES = new Set([
  "V5M13MEM","IMMLEW6V","RMU5MHEF","DZF1R0QR","SNMPCL58","S7EII83D","5J3B8YUT","0RJNM3SQ","0MJYOIF0","U5P3SKF7",
  "OYGOUMAN","111C3AOE","PAQP35H9","R5Z455NU","078SH0NL","CP83O4X7","QYXWPJZM","JLNS2DU1","HH4QN9RX","VWYFIVR6",
  "HEH3UE7Q","29MLLVK7","KH1CASVX","5UW6UAQ7","C80XPHNO","NAC30AC5","2U1J8725","WM1FS0I8","KFV7UCEB","RTDMLYEZ",
  "DMELQ6SI","YDLRES71","0V6QYENY","M0GCXT2O","F1RU3SZ9","BQZMND66","WFW43XPX","41A98F2M","CEYE9G12","I4TXAH6C",
  "GWDMZIGL","SZWBJM1X","Q422EYYB","HU2J6OT2","46YOFVXW","LKCWY709","Q462VRYR","SQTZFJOR","AWVI1IQ1","FTXEI8UC",
  "30C7VHUF","05AVY261","MBKM9LAJ","9AXDN0NL","IOCYSVTZ","B1SNEHWW","KS6THVZ6","SCIYTUS9","S47KILBJ","OV2UWJVW",
  "1SC8RKM4","TQWH8FSI","F6T7DFCX","FEUA4D0U","DI0ZXDLY","OMCTTNCZ","7WBX8WVI","6K4EIWA6","JMZGPWMI","F3PSAXJU",
  "H2YA7SLL","MLF2UJP0","9BGOCTXJ","YYICYK2E","8UF609OV","F6G3ET00","BOOU05YZ","SORGY8K2","WQZZQB94","L4IFKQ8R",
  "MF8MM2U7","J8L2PQWS","76IAPUFV","83C2NFHY","QSVEA2M1","171KRARL","831KH8GC","JALBX0MV","AQXU4Z88","UNQNSBSX",
  "SEKAUC4O","TTSWHO1T","Z9Z6B8PX","B5SWHSSX","D51RX73W","YEVP6BMA","P4WOR0U9","GEQK2V97","RN0HZM2A","XO8IMBS5",
  "1U1I1E9U","ORT5R0J7","P7JVO7UK","HZ8TX62P","T10JJBOX","FLHKJ74W","S76MYOYW","PSJ7OZMH","P55DDG55","SR9O71HO",
  "BTN5OMZF","SAPPA8NK","GG5ZA9OU","M1QU8Z3Q","74XX1U9H","QYPYCZHC","JR99RO94","Z49MYKTC","00GKBHU0","GMYVPYUM",
  "UIQ4JPEB","JSY52VZL","CPFEQ7X6","0K4TC5LH","P0QG9A15","MXED1575","YG4GY89E","I8A5NUTM","4KVN5GC3","OV87ARNA",
  "A69JRERU","HH8F9F61","EOLENVPE","7NOJNXYK","S00BYV3X","S272M0KL","8B5LYNLR","3YIXQ19E","USDNQ5RO","OOJDS7BO",
  "H4ZK2789","8CZN3OEK","23NAKP26","5T1XN54M","YXEKXYVA","9DAHG37T","RNZ0055G","QL3T4IO5","L94P1NPT","DM6LQBJR",
  "CI5M5LXL","A3DR6090","UWECN4S6","J9MU0UPN","7OPZLOB2","ZW4KAYXL","V82EHN1I","LTKEFUYW","33XI5JFP","3O2G2ZWA",
  "FHKY9C2Y","52BAY2H4","BVUBGXOM","SMSVAKXS","POP1IEZL","RUI3NPED","03TQ0JB3","DNVSQ7EH","1WWQ1YT0","E68II1C9",
  "M1B5CEF2","ZDON6UK4","RASUMZFN","PLX75OWU","KUI79E7M","NPJ3IEXQ","QXHHKE27","VJ6AWQJB","0W7DD02I","5RT0UCFS",
  "KL1FXN4K","NSZBWOQ9","RT4907QV","5IGYOZHV","NM2QVO1T","VXIGQTPM","67PWAOQC","3WLCKIGE","DMS846DG","UP83U6X9",
  "H4Z1U461","RDT02OMK","SG3IFZ4Z","M2B3V7Q9","8TRRM40Q","D9KLKHKB","J77BDNGV","46ITWG42","POA1A5DA","AGHSZM15",
  "F1C4WP15","IN1F0A29","P5M05BSK","9AE7Y5AY","7C94L32H","ISM4TFHU","I2VUYSOK","DY1NWUPD","AJBXJTYP","9QFYIBMW",
  "FG4OV89M","83WSQZRK","QPP5SGUL","J2OM61C1","7BFEIMJ6","8ORKKJV1","A17UF352","D7O0HO2S","2AI73JQD","NLGDW6Q6",
  "Q46HF063","7NTMKPYP","QYLHU6EL","BI6VWWBN","P3PLWC72","IQJYN0P5","WQ7988TG","27Z7WUM6","2B56VC9N","KLWCOAJ9",
  "SRK8RQFH","QNXSXDVH","OLXPOIAF","K996F8QB","JVU48D31","2E5WEZUI","JQ8PHF1L","7XSD0BL6","0JXKI3MJ","UHQSDOLP",
  "25R9O4CQ","49GOR72Z","ZILTL9VY","G7PHIKQE","YJCT22UP","XH6V1QEI","TFZUAYHT","QW9N7C12","5QCRZ86A","JIYKYAWK",
  "OZ3CF1PI","2DZJA509","WPZU59D2","295MQ0A9","KXYS8QI8","0AD35TUA","5FZ7S4CT","ASMJZ0HR","KJ3PAS6G","RDR9TPON",
  "PP4S4MXH","1582L6YM","QVNZTMW1","WBRBSOZA","EG3CJBRH","WWIYCQHD","PN14XI7O","NHHGGREJ","8Z3D2X3L","FHQVJLPT",
  "MA82QN0P","XP970OIJ","X27FFDJF","3AH4LJ6E","477DWWI6","04JLYB5F","TTO3U77R","8J7GYNMO","L0VH3C12","RHS7PUKG",
  "YI090LXU","JMWAH2QK","L8BUUFU5","DKEMI8PR","D0QXGBKO","H0M0ZVZK","17F3WTLT","XAQEYM6P","0FXNBJKK","VWBPHYE6",
  "7087QJBN","PF0UM4OX","O7PWT4EK","MMR7VKQ1","KLTRDOPP","Q71C72QC","TQ7HQGJG","BNQ0G5VE","LSTWT4TC","JNYHI7T3",
  "80B22KYL","B31ZNDIQ","YATCF0MR","99X28WEX","JDWLAGRL","ECDSY8W4","NB8HB8M8","RSG0Y4AG","T4OCR5QJ","CF9HGD0K",
  "SQZEY8XH","27X8CP8Q","67OVIUXZ","1NAC2ERS","06CYPU36","0LDXEPMK","UCO6W4I2","UOL3MLUS","SFML6BAS","TTT4JO7S",
  "FL305YJB","UFT1NT5A","QM8K6X5U","8VV56435","2LF0BIIT","SVIK2L7L","1OA98PB6","L71UBB40","J9YF3ZIX","HG92GGPH",
  "G7G72THW","TP8PANRD","RITYYPAU","M4FD41UF","3MOEEQ7D","7SFXTF0K","JAN1NXEX","VQMUPJBG","OGQOYHVK","KNMUSALT",
  "MPZ1P8A2","C3D79D94","ROESXK36","82FWFJNQ","B2HXGFF5","TTUKH690","DVO40POW","EGWHPWE4","ZGGC46PU","ES28WAI9",
  "R7R9CYCG","6L18IYUI","NH2VF9RX","2NZOJD0L","SWH9BF4F","58JP1HLG","BF3UECPH","V3IL1SWQ","CZ1T1SN3","V6FXG14Q",
  "U296QK5A","YYB8ZVME","PKNDTR7A","531AZ2ZL","S9D2797Z","RIZ8ROZY","ZEOW79VC","MVNM8T64","KUB4061U","O115X5CH",
  "GWWWH02Y","5DXJ83JA","HINTMB0S","KZ74NTBT","H5763BUZ","B3IWYY3H","RXQ8IZEU","MOVNU57M","JBXVS6YA","RMDB5XGZ",
  "S6QYY1ZQ","75OD1PH0","9VSWZKCB","CD8IUTJ1","FX7TC4VZ","4V84MNQI","GEZX0ZLP","UOHX7BMM","61N7G4BG","DREIXITB",
  "9PX5BO0W","QCON4VTA","G000XEPF","MYQXKGU6","727TQTTY","TVQLFJXM","ZVBBVYO4","AJHWTBC5","NBUY18GN","TI2A1L6C",
  "X9ETFKSM","1AUXC0TT","FBUZG11I","G7AAIIMY","XX15629V","PDPGJUNE","ECMJWK4G","SZEK2411","QKP2NDZO","YG3SXTR4",
  "0HUTZCNG","X39GVLXU","FY482YY5","SG3SS3BI","8CNX919G","0CR4PYYX","PUMXT21X","RTYF237Q","LG00J921","6MLP29B5",
  "M2PG9TDX","3C8FMD3X","0IJT67PA","KA4CUJML","MUN1I50O","CE6N4JX2","0VDL9KKS","0VNLHLED","51H3AL8C","ER9DYE9U",
  "PJGDHDBO","S3OB71WA","33QVZSZF","39L3HBX7","M635LAW6","8VDDEI2X","D2OCGWAP","GIK6VG3C","IKYZXQT0","Y5U4HOZ5",
  "VDSVSY5B","3BCT0P4F","SYEWLFSJ","DESGE6OH","6P4L4LR9","XN56Y9JF","Z82NLXG5","O3QGCD8M","CZW5EETO","D6LQSQOI",
  "NF33M59T","MLF4XD5Q","FMQYC68O","ZQRZSASF","TLJNB14M","CD1UAFXO","QROY4YCH","PS7WI2JN","ZHOL9QR1","GL9Q1K7N",
  "O8IG6IXU","BY3PMLQT","URJFYCGJ","JZSU1G68","TB3N8UNY","OCNO3Y1R","MI4CLR6G","JQ6PNSPK","0TLUBHUB","SC9BFOZD",
  "0NF9ORJO","6DBRLNPM","O1V0VJ32","UK48IAN8","1CDBO7YU","YMCCD6CC","77W5P1P9","5BSAE2CX","1E5M52FZ","72WR4D86",
  "NJGQGV6U","1IU8IAAL","9DDJ4NOF","QYYR5XX3","8UTE319D","Q397J771","SF5TROT0","8WQZIIFN","T04HE6FO","8R46HMHK",
  "WFXBAV6E","0AF8W61T","58QEXTLI","2LBIKS1K","0IO4ZSCI","J99VZ5JG","V8L2B5KC","JFKLHI0J","J7C66MGT","043JTB0S",
  "QZUTYNB5","H84441FI","HLA4J67K","5WPOUMNE","JMG9TPEG","6VY38FI6","K5EYXOVJ","89S6W401","NU5OMBPO","A7W4J006",
  "8FS2OII5","RIR711VJ","ACWV0ZKY","PUXMGWM4","IT41OPTB","VTJGYMJB","DX195UN5","VVNQQNRA","XJLHB6JN","679P1UH1",
  "USYXVN8E","FXE9CA7A","FYKQHT1J","Y50PG20H","3VEBOIBC","5H2HBBRN","G52ZWJKY","9C5MG2JQ","2DLYLZ2N","ITDCI6EN",
  "9EASE5T0","V8JK9SC0","77ABIVE1","76U0G4MN","O5AVTHA3","23OYGIXB","CLDNXA0T","KUPNRQBA","F2NXMAD3","EOBQHPAI",
  "SJI7VRKP","GSJEK6TY","5Y6ELI4R","3XY14SNZ","QWEBMQ9S","SBUNLVOY","36JRI76B","NXENJIIO","RVR20NH9","Y4IQHJIH",
  "CXO5V3TL","SO4KQJDH","W4CN4EYB","IK7GGEZA","WA8GTG8I","CVWAV2OA","DR15NUYB","NKJDZARG","X7LN86QK","TPJVW4QR",
  "0HI3JMJG","5BKUGBLR","P77WGBSL","SF6XPH26","DY195AA9","JGOE5AWG","O4AG21KC","5UMGMIU0","O09155DD","ELJTPBL6",
  "0F4D7ZSF","4KQX7BHF","UH5L5RS9","47RT1YGT","W0944MHT","IQ5C1DTP","VFA2U3N0","UYNWSIDY","R27KUY6U","USCK9496",
  "I42NO3KD","JRM7ISJG","FD8RTM7K","ET7475FG","ERBCPJJ4","UDDVDXEA","O03MLWX9","ME2ZA1MT","B771MKAQ","0CAADX2P",
  "1634EUTD","1TG2BSBY","NX0ZMV3L","OV4TCJL0","BB0Q07P6","LHZQJV6W","225LUGLR","CAPIJC35","ROLDHHMN","2MFBDY07",
  "GKI4ZSIQ","LZE676VZ","UZPH9AA6","UCSUZ4QS","NYUUZ0DQ","KEKS4CB5","DYS2Z9AG","2DSBXM4G","A9EJGUW9","X2DOEQM0",
  "MW06VXMY","5SIXX3DQ","QA20Q2I5","HA051R3B","UXZ0VM7E","P8X4KUEE","XI6VCV8K","FPZ381O2","PQ6I0M5Z","BGTUECJW",
  "0TP7T3DD","FEKSNDPE","P60FQ1NS","I45UGM17","YWIVCYX5","PIFY9YW8","RZ7MLVCB","HYLK5JHV","UAFES82J","DMGXM97M",
  "XVIHFMAO","ANJNA1Q1","V6ZA62FL","4RNDDOL2","1PGK9RLA","7BBIEA8O","XKDUZ9Q8","5MN8B41Y","2CDS8LVN","VJOZ1RGF",
  "IRZE2XHC","CQ1QOTIK","V8J1XTTF","DDOQHP5I","2GS9WMXM","T01WZK8E","SKGKCHGI","M9EGUUZ4","PEHIFE1M","ND9LC98R",
  "MDYH5RBK","UTHASR10","577G53I7","S6A2VSMX","L4VWC1YT","55U62WSP","XYEBO0RO","V0LEVQOY","CN3J964Q","ZYIKM66Q",
  "UWXURK5B","D4T814W0","E486A1D6","QUK34EZB","7D8QWSFC","OOWH7WI0","6VSE3XUA","1BUUYLV7","WP4XVH49","G19SVE6L",
  "0AXGYJZI","SDVIX3AE","UY5LK95E","17L87AB4","5C685O7L","9W2ITUJX","5IU633PY","0PSF2C09","LESAHVUZ","1TYDZYU4",
  "9VSWDIO7","UR60D9Z8","WSCA2ANN","0DOYTLJR","5KP4H21W","T2KXUDP7","1IHDWOAV","6606RH2R","YNCYH4OT","QI9DLHBE",
  "GXWSVS9Y","SL7ZL10K","4ECJEOAZ","GX2VF7WT","4GD2B4JQ","LPRHCELA","LAB4QMGU","YN23Y12E","4GL4QVJ8","N5R24U3T",
  "MHSQMAIN","AWT71BL7","VE3ZY5LF","3JYRRBRQ","71YFPJKS","317UJH92","NP1YZN06","5NZWKSV2","IT0RK1RU","WHBO5SJ3",
  "C8ECRY7J","QTTQS858","ZNCNDWQH","3I8SB8B8","U2VKKERS","COBBJIGU","B5BDXMVE","G6ZAAR9G","TAOVBNB1","9QV8OTIT",
  "35VX6OTI","8YOA46Q1","LHIYNSAH","66WLFR9O","8UGKE9BY","YNNAYH7G","I3EVBF4D","69M5KX5M","BE6M8LEO","1N9079HU",
  "H7AJIEAB","Y15FIW34","XKTOES30","34RQT7YY","MWFMLVVD","57AJ0088","XIFRV5KD","S94LDPYO","6RF772O1","49QKVOKO",
  "XEFDZHU6","AO5EL7K4","RKCMUY3Q","VJVLM9Q2","V8L9HMSP","PQDD25BM","KIPGH5EK","XYJVKZSK","62VAKNV9","SNST8VL4",
  "FAJDKRWY","PM5VCY1X","DMVBZ96D","6TCX8LRK","MMCX7024","W0G4FYWP","SB1BXGDF","4PSR10HI","7E7QSBMB","67BS6S5D",
  "FNWC5EIC","UCBEETN9","C7LRNLMA","1AM67H2O","ZBK2J0Q2","VMKA2NZV","I59F1UN8","GFT1SSIQ","PR5RYEHA","WCY0QOCR",
  "QSNYKNU1","XAI8WCZB","M4606DRM","7Z1MJ8WK","KKJBDU4W","0K0HWCB3","FX0MZMT2","X6MISIZD","7E0ISBM4","GUPED3I9",
  "PRCL2XR6","AVQVJ7H4","P0HI1YNT","62QAACC1","DFQKXFP0","9T1XGE5L","08C9WITZ","YUYON17K","CI9KK4K8","83IGP50M",
  "0IZYCF7X","C2EWTLKK","SAZB4V84","HJEW7IIZ","7NHIYRX7","TR4V1CGN","ZVA2MR9N","NSNKF2TX","OBQJ20XV","3045U8Q7",
  "KS38JE4E","COY8LU8R","VFQADCTL","Q8G3UTQ9","EIV1UBGH","RAFKS9TS","36OIBP5Z","UNVO35FN","0M1RJGJW","JFAIQUZM",
  "XNSG0JBS","A821I7YG","S68X9W5R","FV7SUQ5K","XD21JLWD"
]);

// Animated counter component
function AnimatedCounter({ value, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          let start = 0;
          const end = parseFloat(value);
          const increment = end / (duration / 16);
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`counter-${value}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return (
    <span id={`counter-${value}`}>
      {typeof value === 'string' && value.includes('.') 
        ? count.toFixed(1) 
        : Math.floor(count)}
      {suffix}
    </span>
  );
}

// Floating particles background
function ParticlesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        />
      ))}
    </div>
  );
}

export default function Landing() {
  const [inviteCode, setInviteCode] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const [shakeInput, setShakeInput] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate("/dashboard");
    } else {
      navigate("/account");
    }
  };

  const handleJoinWaitlist = () => {
    navigate(createPageUrl("Application"));
  };

  const handleInviteCode = () => {
    const code = inviteCode.trim().toUpperCase();
    if (VALID_INVITE_CODES.has(code)) {
      localStorage.setItem("inviteCodeVerified", "true");
      setCodeError(false);
      navigate(createPageUrl("CreateAccount"));
    } else {
      setCodeError(true);
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleInviteCode();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color="#B19EEF"
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          speed={0.6}
          edgeFade={0.25}
          transparent
        />
      </div>
      {/* Custom styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.1); }
          50% { box-shadow: 0 0 40px rgba(255,255,255,0.2); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-10px); }
          40%, 80% { transform: translateX(10px); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-glow { animation: glow 3s ease-in-out infinite; }
        .animate-slideUp { animation: slideUp 0.8s ease-out forwards; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
        .pulse-ring::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(34, 197, 94, 0.5);
          animation: pulse-ring 2s infinite;
        }
        .gradient-text {
          background: linear-gradient(135deg, #fff 0%, #888 50%, #fff 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient 5s ease infinite;
        }
      `}</style>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-xl z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ce5d09cbce0fa35e3dca6/1f3c43b3b_image.png" 
            alt="Stoneforge" 
            className="h-10 transition-transform hover:scale-105"
          />
          
          <div className="flex items-center gap-2">
            <Link to={createPageUrl("MeetOrion")}>
              <Button 
                variant="ghost" 
                className="text-gray-400 hover:text-white transition-all duration-300 hover:bg-white/5 gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Meet Orion
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              onClick={handleLogin}
              className="text-gray-400 hover:text-white transition-all duration-300 hover:bg-white/5"
            >
              Log In
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 relative">

        <ParticlesBackground />
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

        <div className={`text-center max-w-5xl mx-auto relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Invitation Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-700/50 rounded-full text-sm mb-12 bg-white/5 backdrop-blur-sm animate-glow">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-gray-300 tracking-wider font-medium">INVITATION ONLY</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-8xl font-extralight mb-4 tracking-tight">
            The World's First
          </h1>
          <h2 className="text-5xl md:text-8xl font-bold mb-4 tracking-tight gradient-text">
            <DecryptedText text="Democratized" animateOn="view" revealDirection="center" speed={100} maxIterations={15} loop={true} pause={5000} />
          </h2>
          <h3 className="text-5xl md:text-8xl font-extralight text-gray-500 mb-10 tracking-[0.2em]">
            Hedge Fund
          </h3>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-400 mb-2 font-light">
            Fully automated institutional strategies. AI trades while you sleep.
          </p>
          <p className="text-xl md:text-2xl text-white font-semibold mb-16">
            $299/month. <span className="text-gray-500">No hidden fees.</span>
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 max-w-4xl mx-auto">
            {[
              { value: "24.7", suffix: "%", label: "AVG RETURN" },
              { value: "15", suffix: "K+", label: "INVESTORS" },
              { value: "2.1", suffix: "B", label: "AUM", prefix: "$" },
              { value: "73", suffix: "%", label: "WIN RATE" }
            ].map((stat, i) => (
              <div 
                key={i} 
                className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:bg-white/10"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-1">
                  {stat.prefix}<AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-gray-500 tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-4 max-w-md mx-auto">
            <Button 
              onClick={handleJoinWaitlist}
              size="lg" 
              className="bg-white hover:bg-gray-100 text-black h-16 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] group"
            >
              JOIN THE WAITLIST
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-16 text-lg font-semibold rounded-full border-gray-700 text-gray-300 hover:bg-white/10 hover:text-white hover:border-gray-500 transition-all duration-300 bg-transparent"
                >
                  <Key className="w-5 h-5 mr-2" />
                  HAVE AN INVITE CODE?
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-950 border-gray-800 text-white sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center">Enter Invite Code</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 pt-6">
                  <div className={`relative ${shakeInput ? 'animate-shake' : ''}`}>
                    <Input
                      placeholder="XXXXXXXX"
                      value={inviteCode}
                      onChange={(e) => {
                        setInviteCode(e.target.value.toUpperCase());
                        setCodeError(false);
                      }}
                      onKeyPress={handleKeyPress}
                      className={`bg-gray-900 border-2 text-white h-14 text-center text-xl tracking-[0.3em] font-mono uppercase transition-all duration-300 ${
                        codeError 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-700 focus:border-white'
                      }`}
                      maxLength={8}
                    />
                  </div>
                  
                  {codeError && (
                    <div className="flex items-center justify-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-slideUp">
                      <XCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Invalid invite code. Please check and try again.</span>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleInviteCode}
                    className="w-full bg-white hover:bg-gray-100 text-black h-14 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-[1.02]"
                  >
                    Continue
                  </Button>
                  
                  <p className="text-center text-gray-500 text-sm">
                    Don't have a code? <button onClick={() => { setDialogOpen(false); handleJoinWaitlist(); }} className="text-white hover:underline">Join the waitlist</button>
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Scroll indicator */}
          <div className="mt-8 flex justify-center animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-gray-700 flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-gray-500 rounded-full" />
            </div>
          </div>
          </div>
      </div>

      {/* Features Grid */}
      <div className="py-32 px-6 bg-transparent relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Why <span className="gradient-text">Stoneforge?</span>
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Built for the modern investor who demands more
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Brain, title: "AI-Powered", desc: "Orion AI analyzes markets 24/7 and executes trades autonomously" },
              { icon: TrendingUp, title: "High Returns", desc: "24.7% average annual returns with sophisticated strategies" },
              { icon: Shield, title: "Bank Security", desc: "Your assets stay in your brokerage. We never custody funds" },
              { icon: Globe, title: "Global Markets", desc: "Trade stocks, crypto, forex, and options worldwide" }
            ].map((feature, i) => (
              <div 
                key={i}
                className="p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traditional Finance Is Broken */}
      <div className="py-32 px-6 bg-black/40 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-light text-center mb-6">
            Traditional Finance <span className="text-gray-600">Is Broken</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mt-20 mb-20">
            {[
              { value: "2%", label: "Management Fees", sub: "Plus 20% of your profits" },
              { value: "0%", label: "Transparency", sub: "Black box strategies" },
              { value: "$1M+", label: "Minimum", sub: "Exclusive to ultra-wealthy" }
            ].map((item, i) => (
              <div 
                key={i}
                className="text-center p-10 border border-gray-800 rounded-3xl bg-gradient-to-b from-gray-900/50 to-transparent hover:border-gray-700 transition-all duration-500 hover:scale-105"
              >
                <div className="text-6xl font-bold text-white mb-3">{item.value}</div>
                <div className="text-xl text-gray-300 mb-2">{item.label}</div>
                <div className="text-sm text-gray-600">{item.sub}</div>
              </div>
            ))}
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-light mb-6">We're changing everything.</h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              Stoneforge democratizes institutional-grade trading strategies through AI-powered automation, complete transparency, and a simple flat-fee structure.
            </p>
          </div>
        </div>
      </div>

      {/* Orion AI Section */}
      <div className="py-32 px-6 bg-black/40 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5" />
        
        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Link to={createPageUrl("MeetOrion")} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full text-sm mb-8 border border-purple-500/30 hover:from-purple-500/30 hover:to-blue-500/30 transition-all cursor-pointer">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300">FULLY AUTOMATED</span>
              </Link>
              <h3 className="text-4xl md:text-5xl font-bold mb-4">
                <Link to={createPageUrl("MeetOrion")} className="hover:text-purple-400 transition-colors">Orion AI</Link>
              </h3>
              <h4 className="text-2xl text-gray-400 mb-8">Trade While You Sleep</h4>
              <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                Orion never sleeps. Our AI executes trades 24/7 based on real-time market analysis, sentiment shifts, and macro events. Set your strategy once, then let Orion handle everything while you focus on life.
              </p>
              <div className="space-y-4">
                {[
                  "Fully autonomous trading execution",
                  "24/7 market monitoring & analysis",
                  "Instant reaction to market events",
                  "Zero manual intervention required"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trading Log Card */}
            <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-3xl border border-gray-800 p-8 animate-glow">
              <div className="flex items-center justify-between mb-8">
                <h4 className="font-semibold text-white text-lg">Orion Trading Log</h4>
                <div className="relative">
                  <span className="px-3 py-1.5 bg-green-500/20 text-green-400 text-xs rounded-full font-semibold pulse-ring">
                    LIVE
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { time: "2:47 AM", type: "AUTO EXECUTED", msg: "Bought NVDA @ $247.50 - Market sentiment shift detected" },
                  { time: "3:15 AM", type: "MONITORING", msg: "Fed announcement in 6hrs - Adjusting crypto exposure" },
                  { time: "4:22 AM", type: "RISK MANAGEMENT", msg: "Portfolio rebalanced - Energy sector overweight detected" },
                  { time: "5:01 AM", type: "AUTO EXECUTED", msg: "Sold TSLA @ $251.20 - CEO tweet sentiment negative" }
                ].map((log, i) => (
                  <div key={i} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-colors">
                    <div className="text-xs text-gray-500 mb-1.5 font-mono">{log.time} - {log.type}</div>
                    <div className="text-sm text-white">{log.msg}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-6 text-center">All trades executed automatically while you slept</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copy Trading Section */}
      <div className="py-32 px-6 bg-black/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Top Performers Card */}
            <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-3xl border border-gray-800 p-8">
              <h4 className="font-semibold text-white text-lg mb-8">Top Performers</h4>
              <div className="space-y-4">
                {[
                  { rank: 1, name: "Alex_Trader", focus: "Tech Focus", return: "+24.7%", win: "73%" },
                  { rank: 2, name: "CryptoKing", focus: "Digital Assets", return: "+31.2%", win: "68%" },
                  { rank: 3, name: "ValueHunter", focus: "Value Stocks", return: "+18.9%", win: "81%" }
                ].map((trader, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-gray-800/50 rounded-2xl border border-gray-700/50 hover:border-gray-600 transition-all hover:scale-[1.02]">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        i === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' :
                        i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
                        'bg-gradient-to-br from-amber-700 to-amber-800 text-white'
                      }`}>
                        {trader.rank}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{trader.name}</div>
                        <div className="text-xs text-gray-500">{trader.focus}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold text-lg">{trader.return}</div>
                      <div className="text-xs text-gray-500">{trader.win} Win</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-4xl md:text-5xl font-bold mb-6">Copy Trading</h3>
              <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                Mirror the world's best traders with full transparency. See their exact strategies, win rates, and risk profiles before you copy.
              </p>
              <div className="space-y-4">
                {[
                  "Verified performance history",
                  "Precision copy controls",
                  "Automatic risk management"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-300 text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bank-Grade Security */}
      <div className="py-32 px-6 bg-transparent">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Bank-Grade Security</h2>
          <p className="text-gray-400 text-xl mb-20 max-w-2xl mx-auto">
            Your assets never leave your brokerage account. We execute trades via API only.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Lock, title: "Zero Custody", desc: "We never hold your money" },
              { icon: Shield, title: "AES-256 Encryption", desc: "Military-grade protection" },
              { icon: CheckCircle, title: "SOC 2 Certified", desc: "Independently audited" }
            ].map((item, i) => (
              <div key={i} className="p-10 border border-gray-800 rounded-3xl bg-gradient-to-b from-gray-900/50 to-transparent hover:border-gray-700 transition-all duration-500 hover:scale-105">
                <item.icon className="w-12 h-12 text-white mx-auto mb-6" />
                <h4 className="text-xl font-semibold mb-3">{item.title}</h4>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-32 px-6 bg-black/40 backdrop-blur-sm">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-20">
            One Price. <span className="text-gray-600">Everything.</span>
          </h2>

          <div className="p-10 border-2 border-gray-700 rounded-3xl bg-gradient-to-b from-gray-900 to-gray-950 hover:border-white/30 transition-all duration-500 animate-glow">
            <div className="flex items-baseline justify-center gap-2 mb-8">
              <span className="text-7xl font-bold text-white">$299</span>
              <span className="text-gray-500 text-2xl">/month</span>
            </div>
            <div className="space-y-4 mb-10 text-left">
              {[
                "Unlimited AI signals",
                "Copy trading access",
                "Premium community",
                "Priority support"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-200 text-lg">{item}</span>
                </div>
              ))}
            </div>
            <Button 
              onClick={handleJoinWaitlist}
              className="w-full bg-white hover:bg-gray-100 text-black h-14 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              GET EARLY ACCESS
            </Button>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-32 px-6 bg-black/40 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Join The <span className="gradient-text">Exclusive</span> Waitlist
          </h2>
          <p className="text-gray-400 text-xl mb-12">
            Be among the first to access institutional-grade trading strategies.
          </p>
          <Button 
            onClick={handleJoinWaitlist}
            size="lg" 
            className="bg-white hover:bg-gray-100 text-black h-16 px-16 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            SECURE YOUR SPOT
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="py-10 px-6 bg-black/80 backdrop-blur-md border-t border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <div className="text-gray-600 text-sm">
            © 2025 Stoneforge Trading. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
