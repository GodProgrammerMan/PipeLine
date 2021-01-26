using System;
using System.Collections.Generic;
using System.Text;

namespace IPipe.Common.Helper
{
    public class CoordinateCalculation
    {
        public static double[] shenzhenToBd(double x, double y, double z)
        {
            double[] sz = { x, y, z };
            double[] wgs = shenzhenTOWGS84(sz);

            double[] gcj02 = WGS84ToGCJ02(wgs);
            double[] db = gcj02ToBd(gcj02[0], gcj02[1]);
            db[0] = db[0] + 0.000325802700999134;
            db[1] = db[1] - 0.000321856414799981;
            return db;
        }
        public static double[] WGS84TOBD(double[] wgsArr)
        {
            double[] gcj02 = WGS84ToGCJ02(wgsArr);
            double[] db = gcj02ToBd(gcj02[0], gcj02[1]);
            //db[0] = db[0] + 0.000325802700999134;
            //db[1] = db[1] - 0.000321856414799981;
            //db[0] = db[0] + 0.00548067512527;
            //db[1] = db[1] - 0.002558873036861;
            db[0] = db[0] + 0.00549193449961;
            db[1] = db[1] - 0.002656157015784;
            return db;
        }

        public static double[] BdTOwgs84(double x, double y)
        {
            var s_gcjo2 = bd09togcj02(x, y);
            var s_wgs84 = gcj02towgs84(s_gcjo2[0], s_gcjo2[1]);
            return s_wgs84;
        }

        /**
        * GCJ02 转换为 WGS84
        * @param lng
        * @param lat
        * @returns {*[]}
        */
        public static double[] gcj02towgs84(double lng, double lat)
        {
            if (out_of_china(lng, lat))
            {
                return new double[] { lng, lat };
            }
            else
            {
                var dlat = transformlat(lng - 105.0, lat - 35.0);
                var dlng = transformlng(lng - 105.0, lat - 35.0);
                var radlat = lat / 180.0 * PI;
                var magic = Math.Sin(radlat);
                magic = 1 - ee * magic * magic;
                var sqrtmagic = Math.Sqrt(magic);
                dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
                dlng = (dlng * 180.0) / (a / sqrtmagic * Math.Cos(radlat) * PI);
                var mglat = lat + dlat;
                var mglng = lng + dlng;
                return new double[] { lng * 2 - mglng, lat * 2 - mglat };
            }
        }


        /**
        * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
        * 即 百度 转 谷歌、高德
        * @param bd_lon
        * @param bd_lat
        * @returns {*[]}
        */
        public static double[] bd09togcj02(double bd_lon, double bd_lat)
        {
            var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
            var x = bd_lon - 0.0065;
            var y = bd_lat - 0.006;
            var z = Math.Sqrt(x * x + y * y) - 0.00002 * Math.Sin(y * x_pi);
            var theta = Math.Atan2(y, x) - 0.000003 * Math.Cos(x * x_pi);
            var gg_lng = z * Math.Cos(theta);
            var gg_lat = z * Math.Sin(theta);
            return new double[] { gg_lng, gg_lat };
        }

        /**
         * 第一个为x，第二位y，第三个为z
         * 
         * @Title: shenzhenTOWGS84
         * @Description:
         * @param szArr
         * @return
         */
        public static double[] shenzhenTOWGS84(double[] szArr)
        {
            double[] WGS84 = new double[3];
            // 常量
            double bjLongAxis = 6378245;// bj长半轴
            double bjShortAxis = 6356863.0188;// bj 短半轴
            double bje = 0.006693421622966;// bj e的平方
            double wgsLongAxis = 6378137;// wgs长半轴
            double wgsShortAxis = 6356752.3142;// wgs短半轴
            double wgse = 0.00669437999013;// wgs e平方
            double G = 114.000;// 角度

            double sx = szArr[0];
            double sy = szArr[1];
            double sz = szArr[2];

            double E = 2472721.34852661 + 0.999845189293312 * sx + 0.0170794528393774 * sy;
            double F = 391032.173570315 - 0.0170794528393774 * sx + 0.999845189293312 * sy;
            double H = E / 1000000 - 3;
            double I = F - 500000;

            double J = 25 * Math.Floor(G) / 9 - 2 * Math.Floor(G) / 3 - 100 * Math.Floor(G) / 90;
            double K = 27.11115372595 + 9.02468257083 * H - 0.00579740442 * Math.Pow(H, 2) - 0.00043532572 * Math.Pow(H, 3)
                    + 0.00004857285 * Math.Pow(H, 4) + 0.00000215727 * Math.Pow(H, 5) - 0.00000019399 * Math.Pow(H, 6);
            double L = Math.Tan(toRadians(K));

            double M = 0.0067385254147 * Math.Pow(Math.Cos(toRadians(K)), 2);

            double N = I * Math.Pow(1 + M, 0.5) / 6399698.90178271;

            double O = K - (1 + M) * L
                    * (90 * Math.Pow(N, 2) - 7.5 * (5 + 3 * Math.Pow(L, 2) + M - 9 * M * Math.Pow(L, 2)) * Math.Pow(N, 4)
                            + 0.25 * (61 + 90 * Math.Pow(L, 2) + 45 * Math.Pow(L, 4)) * Math.Pow(N, 6))
                    / toRadians(180);
            double P = J + (180 * N - 30 * (1 + 2 * Math.Pow(L, 2) + M) * Math.Pow(N, 3)
                    + 1.5 * (5 + 28 * Math.Pow(L, 2) + 24 * Math.Pow(L, 4)) * Math.Pow(N, 5)) / toRadians(180)
                    / Math.Cos((toRadians(K)));

            double Q = 9 * O / 25 + 2 * Math.Floor(O) / 5 + Math.Floor(60 * O) / 250;

            double R = 9 * P / 25 + 2 * Math.Floor(P) / 5 + Math.Floor(60 * P) / 250;
            double S = sz + 52;

            double T = toRadians(25 * Q / 9 - 2 * Math.Floor(Q) / 3 - Math.Floor(100 * Q) / 90);
            double U = toRadians(25 * R / 9 - 2 * Math.Floor(R) / 3 - Math.Floor(100 * R) / 90);

            double V = bjLongAxis / Math.Sqrt(1 - bje * Math.Sin(T) * Math.Sin(T));
            double W = (V + S) * Math.Cos(T) * Math.Cos(U) + 22;
            double X = (V + S) * Math.Cos(T) * Math.Sin(U) - 118;
            double Y = (V * (1 - bje) + S) * Math.Sin(T) - 30.5;
            double Z = Math.Atan(Y / Math.Sqrt(Math.Pow(W, 2) + Math.Pow(X, 2)));
            double AA = Math.Sqrt(Math.Pow(W, 2) + Math.Pow(X, 2) + Math.Pow(Y, 2));
            double AB = Math.Sin(Z);
            double AC = Math.Cos(Z);
            double AD = wgsLongAxis / AA;
            double AE = AD * Math.Tan(Z);

            double AF = Math.Pow(AB, 2) + 2 * AD * AC * AC;
            double AG = 3 * Math.Pow(AB, 4) + 16 * AD * AB * AB * AC * AC + 4 * AD * AD * AC * AC * (2 - 5 * AB * AB);
            double AH = 5 * AB + 48 * AD * Math.Pow(AB, 4) * AC * AC + 20 * AD * AD * AB * AB * AC * AC * (4 - 7 * AB * AB)
                    + 16 * Math.Pow(AD, 3) * AC * AC * (1 - 7 * AB * AB + 8 * Math.Pow(AB, 4));
            double AJ = Math.Tan(Z) + AE * wgse * (1 + wgse / 2 * (AF + wgse / 4 * (AG + wgse / 2 * AH)));
            double AK = Math.Atan(AJ);
            double AI = Math.Sqrt(1 - wgse * Math.Sin(AK) * Math.Sin(AK));
            double AL = Math.Atan(X / W) + Math.PI;
            WGS84[0] = 9 * AK * 180 / Math.PI / 25 + 2 * Math.Floor(AK * 180 / Math.PI) / 5
                    + Math.Floor(60 * AK * 180 / Math.PI) / 250;
            WGS84[1] = 9 * AL * 180 / Math.PI / 25 + 2 * Math.Floor(AL * 180 / Math.PI) / 5
                    + Math.Floor(60 * AL * 180 / Math.PI) / 250;
            WGS84[2] = AA * AC / Math.Cos(AK) - wgsLongAxis / AI;

            WGS84[0] = getToDegree(WGS84[0]);
            WGS84[1] = getToDegree(WGS84[1]);

            return WGS84;
        }

        public static double[] fsTOWGS84(double[] szArr) {
            double[] WGS84 = new double[3];
            // 常量
            double bjLongAxis = 6378245;// bj长半轴
            double bjShortAxis = 6356863.0188;// bj 短半轴
            double bje = 0.006693421622966;// bj e的平方
            double wgsLongAxis = 6378137;// wgs长半轴
            double wgsShortAxis = 6356752.3142;// wgs短半轴
            double wgse = 0.00669437999013;// wgs e平方
            double G = 114.000;// 角度

            double sz = szArr[2];

            double E = szArr[0];
            double F = szArr[1];
            double H = E / 1000000 - 3;
            double I = F - 500000;

            double J = 25 * Math.Floor(G) / 9 - 2 * Math.Floor(G) / 3 - 100 * Math.Floor(G) / 90;
            double K = 27.11115372595 + 9.02468257083 * H - 0.00579740442 * Math.Pow(H, 2) - 0.00043532572 * Math.Pow(H, 3)
                    + 0.00004857285 * Math.Pow(H, 4) + 0.00000215727 * Math.Pow(H, 5) - 0.00000019399 * Math.Pow(H, 6);
            double L = Math.Tan(toRadians(K));

            double M = 0.0067385254147 * Math.Pow(Math.Cos(toRadians(K)), 2);

            double N = I * Math.Pow(1 + M, 0.5) / 6399698.90178271;

            double O = K - (1 + M) * L
                    * (90 * Math.Pow(N, 2) - 7.5 * (5 + 3 * Math.Pow(L, 2) + M - 9 * M * Math.Pow(L, 2)) * Math.Pow(N, 4)
                            + 0.25 * (61 + 90 * Math.Pow(L, 2) + 45 * Math.Pow(L, 4)) * Math.Pow(N, 6))
                    / toRadians(180);
            double P = J + (180 * N - 30 * (1 + 2 * Math.Pow(L, 2) + M) * Math.Pow(N, 3)
                    + 1.5 * (5 + 28 * Math.Pow(L, 2) + 24 * Math.Pow(L, 4)) * Math.Pow(N, 5)) / toRadians(180)
                    / Math.Cos((toRadians(K)));

            double Q = 9 * O / 25 + 2 * Math.Floor(O) / 5 + Math.Floor(60 * O) / 250;

            double R = 9 * P / 25 + 2 * Math.Floor(P) / 5 + Math.Floor(60 * P) / 250;
            double S = sz + 52;

            double T = toRadians(25 * Q / 9 - 2 * Math.Floor(Q) / 3 - Math.Floor(100 * Q) / 90);
            double U = toRadians(25 * R / 9 - 2 * Math.Floor(R) / 3 - Math.Floor(100 * R) / 90);

            double V = bjLongAxis / Math.Sqrt(1 - bje * Math.Sin(T) * Math.Sin(T));
            double W = (V + S) * Math.Cos(T) * Math.Cos(U) + 22;
            double X = (V + S) * Math.Cos(T) * Math.Sin(U) - 118;
            double Y = (V * (1 - bje) + S) * Math.Sin(T) - 30.5;
            double Z = Math.Atan(Y / Math.Sqrt(Math.Pow(W, 2) + Math.Pow(X, 2)));
            double AA = Math.Sqrt(Math.Pow(W, 2) + Math.Pow(X, 2) + Math.Pow(Y, 2));
            double AB = Math.Sin(Z);
            double AC = Math.Cos(Z);
            double AD = wgsLongAxis / AA;
            double AE = AD * Math.Tan(Z);

            double AF = Math.Pow(AB, 2) + 2 * AD * AC * AC;
            double AG = 3 * Math.Pow(AB, 4) + 16 * AD * AB * AB * AC * AC + 4 * AD * AD * AC * AC * (2 - 5 * AB * AB);
            double AH = 5 * AB + 48 * AD * Math.Pow(AB, 4) * AC * AC + 20 * AD * AD * AB * AB * AC * AC * (4 - 7 * AB * AB)
                    + 16 * Math.Pow(AD, 3) * AC * AC * (1 - 7 * AB * AB + 8 * Math.Pow(AB, 4));
            double AJ = Math.Tan(Z) + AE * wgse * (1 + wgse / 2 * (AF + wgse / 4 * (AG + wgse / 2 * AH)));
            double AK = Math.Atan(AJ);
            double AI = Math.Sqrt(1 - wgse * Math.Sin(AK) * Math.Sin(AK));
            double AL = Math.Atan(X / W) + Math.PI;
            WGS84[0] = 9 * AK * 180 / Math.PI / 25 + 2 * Math.Floor(AK * 180 / Math.PI) / 5
                    + Math.Floor(60 * AK * 180 / Math.PI) / 250;
            WGS84[1] = 9 * AL * 180 / Math.PI / 25 + 2 * Math.Floor(AL * 180 / Math.PI) / 5
                    + Math.Floor(60 * AL * 180 / Math.PI) / 250;
            WGS84[2] = AA * AC / Math.Cos(AK) - wgsLongAxis / AI;

            WGS84[0] = getToDegree(WGS84[0]);
            WGS84[1] = getToDegree(WGS84[1]);

            return WGS84;
        }

        private static double x_PI = 3.14159265358979324 * 3000.0 / 180.0;
        private static double PI = 3.14159265358979323846;
        private static double a = 6378245.0;
        private static double ee = 0.00669342162296594323;

        public static double[] WGS84ToGCJ02(double[] wgs)
        {
            double lng = wgs[1];
            double lat = wgs[0];
            if (out_of_china(lng, lat))
            {
                return wgs;
            }
            else
            {
                double dlat = transformlat(lng - 105.0, lat - 35.0);
                double dlng = transformlng(lng - 105.0, lat - 35.0);
                double radlat = lat / 180.0 * PI;
                double magic = Math.Sin(radlat);
                magic = 1 - ee * magic * magic;
                double Sqrtmagic = Math.Sqrt(magic);
                dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * Sqrtmagic) * PI);
                dlng = (dlng * 180.0) / (a / Sqrtmagic * Math.Cos(radlat) * PI);
                double mglat = lat + dlat;
                double mglng = lng + dlng;
                double[] gcj02 = { mglng, mglat };

                return gcj02;
            }

        }

        public static double[] gcj02ToBd(double lng, double lat)
        {
            double z = Math.Sqrt(lng * lng + lat * lat) + 0.00002 * Math.Sin(lat * x_PI);
            double theta = Math.Atan2(lat, lng) + 0.000003 * Math.Cos(lng * x_PI);
            double bd_lng = z * Math.Cos(theta) + 0.0065;
            double bd_lat = z * Math.Sin(theta) + 0.006;
            double[] bd = { bd_lng, bd_lat };
            return bd;
        }

        /**
         * 判断是否在国内，不在国内则不做偏移
         * 
         * @param lng
         * @param lat
         * @returns {bool}
         */
        public static bool out_of_china(double lng, double lat)
        {
            return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
        }

        public static double transformlat(double lng, double lat)
        {
            double ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat
                    + 0.2 * Math.Sqrt(Math.Abs(lng));
            ret += (20.0 * Math.Sin(6.0 * lng * PI) + 20.0 * Math.Sin(2.0 * lng * PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.Sin(lat * PI) + 40.0 * Math.Sin(lat / 3.0 * PI)) * 2.0 / 3.0;
            ret += (160.0 * Math.Sin(lat / 12.0 * PI) + 320 * Math.Sin(lat * PI / 30.0)) * 2.0 / 3.0;
            return ret;
        }

        public static double transformlng(double lng, double lat)
        {
            double ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.Sqrt(Math.Abs(lng));
            ret += (20.0 * Math.Sin(6.0 * lng * PI) + 20.0 * Math.Sin(2.0 * lng * PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.Sin(lng * PI) + 40.0 * Math.Sin(lng / 3.0 * PI)) * 2.0 / 3.0;
            ret += (150.0 * Math.Sin(lng / 12.0 * PI) + 300.0 * Math.Sin(lng / 30.0 * PI)) * 2.0 / 3.0;
            return ret;
        }

        public static double toRadians(double angdeg)
        {
            // Do not delegate to Math.toRadians(angdeg) because
            // this method has the strictfp modifier.
            return angdeg / 180.0 * PI;
        }

        public static double getToDegree(double t)
        {
            int t_degree = (int)Math.Floor(t);
            String c = t + "";
            int asd = c.IndexOf(".");
            String d = c.Substring(c.IndexOf("."), c.Length - c.IndexOf("."));
            d = "0" + d;
            double m = double.Parse(d) * 100;
            int s = (int)Math.Floor(m);
            String f = m + "";
            String g = f.Substring(f.IndexOf("."), f.Length - c.IndexOf("."));
            g = "0" + g;
            double mi = double.Parse(g) * 100;

            double ms = t_degree + s / 60d + mi / 3600d;
            return ms;
        }
    }
}
