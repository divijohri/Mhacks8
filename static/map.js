var map, heatmap;
var start, end;
var directionsService, directionsDisplay;
var policeStations = [];
var libraries = [];
var startend = [];
var currentLat, currentLong;
var myMarker;
var buddyMarkers = [];

function initMap() {

    var myLatLng = {lat: 42.3591, lng: -83.0665};

    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;


    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: myLatLng,
        mapTypeId: google.maps.MapTypeId.HYBRID
    });

    geoLocate();

    directionsDisplay.setMap(map);

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: getPoints(150),
        map: map,
        radius: 15
    });

    var transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);

    var policeData = [[42.3708605145978,-83.07280901351184], [42.42549432808185,-83.05128823715218], [42.40841620243144,-82.99518852876298], [42.311127544659314,-83.09286389473723], [42.38600509769859,-83.1799722274348], [42.37177782260713,-83.2268538852788], [42.37720972777452,-83.13914300684648], [42.432095351321415,-83.11899819387563]];
    for (var i = 0; i < policeData.length; ++i) {
        var position = new google.maps.LatLng(policeData[i][0],policeData[i][1]);
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: '../static/blue_MarkerP.png',
            visible: false
        }); 
        policeStations.push(marker);
    }

    var libraryData = [[42.32328040389013,-83.08894041412334], [42.30460013004569,-83.10740884487858], [42.40156859065538,-82.97437790167565], [42.395204096585445,-83.2053548225668], [42.333963352973484,-83.0468776448296], [42.33192612572043,-83.12730777767533], [42.36330763713403,-83.09333752963502], [42.358093066742526,-83.22049967642508], [42.34047315204276,-83.0233587699621], [42.427134761166954,-82.98403802598973], [42.41638394131857,-83.17283309238202], [42.41480617191481,-83.06012200348957], [42.358401536711455,-83.06671060849577], [42.396761284287265,-83.12740128194397], [42.413580149115866,-83.2492511870453], [42.43363660504726,-83.02977435555528], [42.43127289218781,-83.14417393035808], [42.404016215551074,-82.93737499175475], [42.34310550011011,-83.07422447595924], [42.4297826119116,-83.21764330161865]];
    for (var i = 0; i < libraryData.length; ++i) {
        var position = new google.maps.LatLng(libraryData[i][0],libraryData[i][1]);
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: '../static/pink_MarkerL.png',
            visible: false
        }); 
        libraries.push(marker);
    }


    // Adds markers on click (up to 2)
    var markerCount = 0;
    google.maps.event.addListener(map, 'rightclick', function(e) {
        if (markerCount != 2) {
            if (markerCount == 0) {
                startmarker = new google.maps.Marker({
                    position: e.latLng,
                    map: map
                });
                startend.push(startmarker);
                start = e.latLng;
                ++markerCount;
            } else {
                endmarker = new google.maps.Marker({
                    position: e.latLng,
                    map: map
                });
                startend.push(endmarker);
                end = e.latLng;
                ++markerCount;
                findRoute();
            }
        }
    });

    if (currentLat && currentLong) {
        dropPin(currentLat, currentLong, fb_img);
    }

} // end of initMap();

function refresh() {
    location.reload();
}

function getPoints(points) {
    var crimeData = [[42.4149, -83.2528], [42.4086, -82.9948], [42.4093, -83.0385], [42.4263, -83.0736], [42.3739, -83.0988], [42.3791, -83.0068], [42.4144, -82.9217], [42.3006, -83.0999], [42.4324, -82.9791], [42.4384, -83.0099], [42.3324, -83.0579], [42.4031, -82.9506], [42.3892, -83.171], [42.3323, -83.0579], [42.3314, -83.128], [42.4253, -83.279], [42.3419, -83.2561], [42.3325, -83.0578], [42.3904, -83.007], [42.4456, -82.9709], [42.3613, -83.2032], [42.3708, -83.082], [42.4015, -82.9317], [42.3144, -83.1187], [42.4145, -83.0233], [42.4122, -83.276], [42.4437, -82.9995], [42.4095, -82.9672], [42.398, -83.1979], [42.4014, -83.1939], [42.3393, -83.067], [42.3432, -83.1354], [42.4228, -83.2429], [42.324, -83.064], [42.4462, -83.1069], [42.4032, -83.2475], [42.313, -83.1249], [42.3594, -83.1678], [42.341, -83.0145], [42.3635, -83.1167], [42.3324, -83.0577], [42.2909, -83.1432], [42.3262, -83.1201], [42.3078, -83.1357], [42.3463, -83.0423], [42.4201, -83.0779], [42.4194, -83.1589], [42.3294, -83.0531], [42.3452, -83.0565], [42.4018, -83.1695], [42.4208, -83.2802], [42.4271, -82.9521], [42.4087, -83.1574], [42.3512, -83.0472], [42.4137, -82.9993], [42.4024, -82.9438], [42.3321, -83.0577], [42.3366, -83.1378], [42.3587, -83.2331], [42.3793, -83.0831], [42.4196, -83.1566], [42.4132, -83.0396], [42.4308, -83.2429], [42.3819, -83.0846], [42.3932, -83.2372], [42.3339, -83.0446], [42.3384, -83.0316], [42.3494, -83.0707], [42.4349, -83.1641], [42.4343, -83.0047], [42.343, -83.2563], [42.4146, -82.9504], [42.4145, -82.9504], [42.3526, -83.1775], [42.4069, -82.971], [42.44, -82.9762], [42.4126, -83.0062], [42.3514, -83.0579], [42.3737, -83.2212], [42.372, -83.2158], [42.4182, -83.1312], [42.2921, -83.1395], [42.3553, -83.0488], [42.3322, -83.0578], [42.3708, -83.1663], [42.3088, -83.098], [42.3722, -83.1888], [42.3795, -82.9931], [42.4377, -83.1803], [42.3851, -83.1133], [42.3853, -83.1135], [42.4453, -82.9709], [42.4421, -82.9853], [42.3564, -83.2391], [42.3347, -83.0404], [42.4338, -82.9978], [42.4131, -83.0796], [42.4282, -83.0754], [42.4018, -83.1864], [42.3828, -83.1885], [42.3377, -83.2016], [42.3311, -83.0414], [42.413, -83.2425], [42.413, -83.2428], [42.3471, -83.0486], [42.3398, -83.0176], [42.3951, -83.2374], [42.3348, -83.0402], [42.3345, -83.0403], [42.3685, -83.1093], [42.4031, -82.9414], [42.3355, -83.0378], [42.3413, -83.2317], [42.3755, -83.0222], [42.3525, -83.0622], [42.288, -83.1545], [42.3428, -83.0815], [42.4151, -83.1835], [42.3972, -82.96], [42.3479, -83.2262], [42.4322, -83.1021], [42.3529, -83.1001], [42.3656, -83.0673], [42.4242, -82.9974], [42.3167, -83.0796], [42.4145, -83.205], [42.3739, -83.2348], [42.4448, -83.0642], [42.4351, -82.9775], [42.3614, -83.2178], [42.3998, -83.2186], [42.3453, -83.2641], [42.4206, -82.9623], [42.344, -83.2595], [42.4383, -83.0827], [42.4315, -82.9569], [42.3319, -83.0421], [42.3472, -83.0376], [42.3845, -82.9901], [42.3509, -83.0045], [42.4196, -83.2522], [42.328, -83.0519], [42.3309, -83.0495], [42.42, -83.005], [42.3468, -83.0866], [42.3893, -83.1316], [42.3308, -83.0492], [42.4461, -82.9494], [42.3279, -83.052], [42.4236, -83.2279], [42.4382, -83.0579], [42.3394, -83.0295], [42.4415, -83.0238], [42.3606, -83.0339], [42.3328, -83.228], [42.4349, -83.0996], [42.3453, -83.0352], [42.4106, -83.2571], [42.4169, -83.023], [42.344, -83.2154], [42.4338, -83.1787], [42.3704, -82.9974], [42.3965, -83.1107], [42.3516, -83.064], [42.323, -83.1023], [42.3437, -83.2025], [42.3926, -83.1576], [42.4202, -82.9977], [42.4306, -83.2262], [42.4454, -82.9769], [42.4091, -83.064], [42.3955, -83.0228], [42.3911, -83.2016], [42.4193, -83.0121], [42.4458, -83.1561], [42.3074, -83.1091], [42.3733, -83.1682], [42.4449, -83.0651], [42.408, -83.0472], [42.3849, -83.0737], [42.4079, -83.2394], [42.3793, -83.0065], [42.3474, -83.0081], [42.3889, -82.9773], [42.3471, -83.2236], [42.3282, -83.053], [42.3447, -83.0532], [42.3445, -83.0535], [42.362, -83.0618], [42.4408, -83.1571], [42.3446, -83.0534], [42.4027, -83.1494], [42.3357, -83.0372], [42.3339, -83.0677], [42.3387, -83.0429], [42.4354, -82.9884], [42.338, -83.042], [42.4146, -83.2025], [42.4253, -82.9641], [42.3337, -83.0437], [42.3374, -83.0514], [42.328, -83.0518], [42.346, -83.0386], [42.3482, -83.2382], [42.3366, -83.131], [42.3446, -83.0535], [42.3534, -83.0617], [42.3829, -83.1952], [42.4343, -82.9702], [42.4323, -82.95], [42.4144, -83.2023], [42.4143, -83.2172], [42.4343, -83.2352], [42.3361, -83.217], [42.3932, -83.1983], [42.4237, -83.1745], [42.3732, -83.1292], [42.3414, -83.0396], [42.4207, -82.9644], [42.3457, -83.054], [42.4134, -83.1379], [42.4472, -82.9931], [42.3734, -83.1945], [42.3952, -83.2375], [42.3329, -83.0393], [42.4413, -83.0735], [42.3357, -83.0408], [42.3779, -83.0982], [42.4312, -83.2076], [42.3494, -83.0344], [42.4085, -82.995], [42.3427, -83.218], [42.3317, -83.0446], [42.4376, -82.9579], [42.4376, -82.9578], [42.4099, -82.9734], [42.3832, -83.0766], [42.3358, -83.041], [42.4384, -83.0557], [42.4378, -82.958], [42.4469, -83.0805], [42.3921, -82.9641], [42.3314, -83.0655], [42.3369, -83.0557], [42.4122, -82.9381], [42.3649, -83.2189], [42.3749, -83.1695], [42.3646, -83.2459], [42.4016, -83.2392], [42.3225, -83.0967], [42.3709, -83.1733], [42.4092, -82.974], [42.4177, -83.072], [42.3564, -83.1391], [42.379, -83.145], [42.3685, -83.1304], [42.3729, -83.1888], [42.411, -83.1334], [42.3575, -82.94], [42.4266, -82.947], [42.3371, -83.0465], [42.343, -83.026], [42.3319, -83.1182], [42.401, -83.2229], [42.4429, -83.0664], [42.4294, -82.9574], [42.4242, -82.9836], [42.3351, -83.047], [42.4203, -83.0016], [42.3422, -83.0883], [42.4361, -83.0629], [42.3861, -83.2169], [42.3305, -83.0472], [42.3918, -83.1252], [42.3391, -83.067], [42.3324, -83.058], [42.377, -82.9529], [42.3917, -83.0003], [42.3572, -83.1602], [42.36, -82.9943], [42.3734, -82.9903], [42.3836, -83.0575], [42.3659, -82.9724], [42.4407, -83.0418], [42.3666, -82.9708], [42.3952, -83.116], [42.409, -82.9253], [42.3812, -83.1359], [42.4043, -83.2377], [42.3514, -83.0461], [42.2929, -83.1254], [42.3338, -83.0485], [42.3933, -83.1706], [42.3187, -83.1052], [42.3315, -83.0479], [42.4398, -83.2666], [42.3125, -83.1243], [42.3127, -83.1241], [42.4347, -82.9601], [42.3972, -83.2095], [42.4095, -83.0634], [42.3432, -83.2392], [42.333, -83.0478], [42.4404, -83.0635], [42.3431, -83.2303], [42.382, -82.9856], [42.3393, -83.067], [42.4345, -83.232], [42.397, -82.9409], [42.3582, -83.1968], [42.4471, -83.0262], [42.3799, -83.0025], [42.3267, -83.0589], [42.4221, -83.207], [42.3526, -83.2299], [42.4318, -82.9937], [42.4102, -83.076], [42.4038, -82.9385], [42.3358, -83.0503], [42.4362, -83.1453], [42.3592, -83.1008], [42.4111, -83.1864], [42.4148, -83.0793], [42.3335, -83.2167], [42.4412, -83.0245], [42.4039, -82.9972], [42.3772, -82.9425], [42.3678, -83.0811], [999998.9999, 999998.9999], [42.3657, -83.1851], [42.4231, -83.1517], [42.3545, -83.2382], [42.3565, -83.1092], [42.3667, -82.9552], [42.3594, -83.2167], [42.3421, -83.0225], [42.4131, -82.9488], [42.3621, -83.0942], [42.3279, -83.0587], [42.4318, -82.9634], [42.4356, -83.0418], [42.4041, -82.982], [42.4363, -82.9581], [42.4152, -83.2815], [42.3739, -83.2394], [42.3828, -83.0108], [42.3419, -83.2539], [42.342, -83.2538], [42.3878, -83.0213], [42.44, -83.1586], [42.3687, -83.1316], [42.4008, -83.1401], [42.4252, -82.9466], [42.3356, -83.0456], [42.4155, -83.2214], [42.4261, -83.0027], [42.4136, -83.2777], [42.3373, -83.0298], [42.3374, -83.0296], [42.3732, -82.9933], [42.3709, -83.1252], [42.3553, -83.0547], [42.423, -82.9618], [42.3862, -83.2611], [42.3413, -83.2246], [42.3292, -83.0528], [42.4415, -83.0505], [42.3659, -82.9359], [42.3702, -83.2425], [42.3334, -83.117], [42.3598, -83.001], [42.4271, -82.9829], [42.4304, -83.0263], [42.3552, -83.0546], [42.3294, -83.0655], [42.336, -83.1444], [42.3657, -83.1876], [42.3445, -83.0635], [42.4484, -83.0155], [42.3246, -83.0905], [42.3522, -83.1906], [42.3873, -83.1035], [42.372, -83.2375], [42.3579, -83.2165], [42.3422, -83.2098], [42.3269, -83.1216], [42.4017, -83.2071], [42.4293, -83.255], [42.3441, -83.2557], [42.3563, -83.0293], [42.373, -83.1723], [42.3644, -83.0449], [42.4313, -82.9825], [42.4313, -82.9824], [42.3681, -83.2146], [42.3712, -83.0912], [42.372, -83.1391], [42.3613, -83.0246], [42.4381, -83.2479], [42.4352, -83.0117], [42.3714, -83.1889], [42.4168, -82.9355], [42.4069, -83.2394], [42.4077, -82.9711], [42.3563, -82.9987], [42.4346, -83.0633], [42.4151, -82.9262], [42.4259, -82.9489], [42.3316, -83.0468], [42.3575, -83.2359], [42.312, -83.1199], [42.4414, -83.0197], [42.4496, -82.9519], [42.3883, -83.2438], [42.3776, -83.0825], [42.3867, -83.1731], [42.3455, -83.0152], [42.3335, -83.0465], [42.3672, -83.2245], [42.4393, -82.9941], [42.3902, -82.9742], [42.3306, -83.0505], [42.4312, -83.1803], [42.3433, -83.2546], [42.3646, -83.2027], [42.4225, -83.2295], [42.4374, -83.2251], [42.3774, -83.1593], [42.3832, -83.1592], [42.3294, -83.0527], [42.4238, -82.9368], [42.373, -83.105], [42.445, -82.9537], [42.42, -82.939], [42.4314, -83.0422], [42.4162, -82.9524], [42.3786, -83.0693], [42.4419, -83.1693], [42.4272, -82.9707], [42.3828, -83.1264], [42.4311, -83.0603], [42.4303, -83.204], [42.3322, -83.0578], [42.4313, -82.98], [42.4045, -82.9689], [42.3749, -83.1439], [42.4368, -82.96], [42.4309, -83.167], [42.3508, -82.9926], [42.3285, -83.0502], [42.3923, -83.0876], [42.3919, -83.128], [42.4171, -82.965], [42.4009, -83.1958], [42.341, -83.0186], [42.4142, -83.2785], [42.4195, -82.9912], [42.4286, -83.0126], [42.4102, -83.1801], [42.3654, -83.1777], [42.433, -83.0735], [42.3492, -83.2218], [42.3762, -83.1153], [42.3737, -83.1578], [42.3765, -83.1205], [42.3712, -83.206], [42.335, -83.0505], [42.3383, -83.1478], [42.3035, -83.0958], [42.4335, -83.2317], [42.3145, -83.1255], [42.4095, -82.9548], [42.3912, -83.1584], [42.3845, -83.1128], [42.4076, -82.9583], [42.3511, -83.2397], [42.37, -83.0082], [42.3302, -83.0881], [42.3674, -83.1908], [42.4271, -83.2134], [42.3459, -83.2357], [42.3832, -83.1529], [42.3616, -83.2423], [42.4051, -82.9975], [42.3826, -83.067], [42.411, -83.173], [42.412, -83.1757], [42.3725, -83.0006], [42.3337, -83.1412], [42.3871, -83.1913], [42.4229, -82.9381], [42.3351, -83.0471], [42.378, -83.0206], [42.3977, -83.2018], [42.4019, -83.1866], [42.3338, -83.065], [42.4452, -83.1769], [42.3869, -83.1981], [42.4023, -83.1974], [42.4236, -83.0007], [42.4154, -83.2206], [42.3601, -83.0977], [42.3456, -83.0422], [42.4345, -83.0044], [42.3867, -83.1314], [42.3394, -83.0663], [42.3313, -83.0763], [42.3381, -83.1371], [42.3055, -83.1268], [42.4132, -83.1482], [42.4349, -82.9753], [42.3393, -83.0663], [42.3714, -83.1889], [42.4267, -83.0759], [42.3717, -83.2056], [42.3575, -83.0494], [42.4189, -83.1829], [42.3692, -83.059], [42.441, -83.2237], [42.432, -83.1149], [42.3745, -83.222], [42.3867, -83.1986], [42.3904, -83.128], [42.337, -83.053], [42.4095, -83.1598], [42.3757, -83.1696], [42.3678, -83.2635], [42.421, -83.1604], [42.4325, -83.0051], [42.4185, -83.2074], [42.3602, -82.9421], [42.357, -83.0498], [42.3958, -82.9811], [42.3464, -83.2573], [42.4209, -83.1606], [42.339, -83.2231], [42.4244, -83.1578], [42.3605, -82.9876], [42.3439, -83.2232], [42.3546, -83.057], [42.3367, -83.0273], [42.352, -82.994], [42.4042, -83.18], [42.3321, -83.0389], [42.4344, -83.0856], [42.3985, -83.1435], [42.4187, -83.0527], [42.3481, -83.1417], [42.4211, -82.9664], [42.3654, -83.1797], [42.4012, -83.1454], [42.39, -83.1702], [42.3705, -83.1618], [42.4096, -82.9695], [42.346, -83.0382], [42.3653, -83.194], [42.3454, -83.0285], [42.3646, -83.0997], [42.368, -83.1449], [42.4204, -83.1158], [42.3545, -83.2256], [42.3734, -83.2099], [42.4039, -83.1793], [42.4465, -82.9476], [42.3492, -83.1334], [42.3466, -83.0481], [42.366, -83.1802], [42.3338, -83.0493], [42.4438, -83.2329], [42.447, -83.0764], [42.4366, -83.1382], [42.3304, -83.0471], [42.4062, -83.2419], [42.4161, -83.1991], [42.4047, -82.9443], [42.3524, -83.032], [42.3316, -83.048], [42.3433, -83.1333], [999998.9999, 999998.9999], [42.3852, -83.1745], [42.3653, -83.1198], [42.4025, -83.1558], [42.4176, -83.2519], [42.3882, -83.0976], [42.3714, -83.1237], [42.3777, -83.0867], [42.3592, -83.1489], [42.3545, -83.173], [42.3728, -83.2193], [42.3808, -83.088], [42.3379, -83.2275], [42.3584, -83.0612], [42.358, -83.061], [42.3905, -83.0951], [42.4201, -83.003], [42.3927, -83.0055], [42.3795, -83.2743], [42.433, -83.0691], [42.3721, -83.2202], [42.3331, -83.0478], [42.4399, -82.9716], [42.4038, -83.2296], [42.4255, -82.9432], [42.4077, -83.0734], [42.4367, -83.1471], [42.4458, -83.025], [42.4497, -82.9678], [42.4146, -83.2382], [42.3883, -83.2441], [42.4395, -82.9512], [42.3322, -83.0407], [42.4136, -83.2232], [42.3475, -83.2412], [42.3561, -83.0012], [42.4268, -83.0052], [42.3967, -83.1211], [42.3705, -83.0994], [42.3792, -83.1426], [42.4058, -82.9929], [42.3569, -83.0291], [42.426, -82.9551], [42.3313, -83.0388], [42.4007, -83.1378], [42.4112, -83.2042], [42.3475, -83.1222], [42.4295, -82.9373], [42.4138, -83.0407], [42.3716, -83.2266], [42.3346, -83.0402], [42.3771, -83.12], [42.3847, -83.2198], [42.4421, -83.0032], [42.4169, -82.9571], [42.4077, -83.2049], [42.4276, -83.1425], [42.3636, -83.0925], [42.4417, -83.1445], [42.368, -83.0424], [42.3328, -83.216], [42.4433, -83.1858], [42.3243, -83.1184], [42.4003, -83.2676], [42.3361, -83.1249], [42.3229, -83.1048], [42.345, -83.1042], [42.4461, -82.9594], [42.4295, -83.2015], [42.3777, -83.1331], [42.3093, -83.1106], [42.3735, -82.9787], [42.3648, -83.2358], [42.4046, -83.2055], [42.3912, -82.949], [42.3744, -83.1757], [42.4203, -83.1797], [42.3346, -83.0443], [42.3979, -83.1878], [42.3807, -83.1255], [42.3665, -83.1454], [42.3929, -83.2159], [42.3589, -83.1513], [42.4153, -83.252], [42.386, -83.2721], [42.3627, -82.9875], [42.3347, -83.0413], [42.3821, -83.2536], [42.4414, -83.214], [42.3565, -83.1143], [42.3572, -83.0289], [42.3656, -83.2284], [42.3576, -83.222], [42.3262, -83.0578], [42.3344, -83.2295], [42.4024, -83.1692], [42.4145, -83.1798], [42.4159, -82.9112], [42.4046, -82.932], [42.3451, -83.026], [42.4398, -83.1451], [42.3497, -83.0523], [42.361, -83.1382], [42.4198, -83.0077], [42.4303, -83.2132], [42.4394, -82.9581], [42.4382, -83.0056], [42.335, -83.0416], [42.4154, -82.9327], [42.3531, -83.149], [42.3357, -83.1085], [42.4408, -83.0223], [42.3106, -83.1091], [42.3527, -83.1779], [42.3393, -83.1383], [42.4161, -83.0566], [42.3703, -83.0806], [42.3709, -82.9537], [42.4197, -82.9642], [42.4294, -83.2368], [42.392, -83.1229], [42.4092, -83.1891], [42.3312, -83.076], [42.4048, -82.9299], [42.3745, -83.1535], [42.4048, -83.2445], [42.4, -83.2736], [42.3172, -83.107], [42.3405, -83.0629], [42.4337, -83.2481], [42.333, -83.0551], [42.3614, -83.1312], [42.3867, -83.0752], [42.379, -83.2621], [42.3772, -83.078], [42.347, -83.2307], [42.3393, -83.1325], [42.3794, -83.1149], [42.3766, -83.154], [42.3431, -83.2327], [42.3438, -83.0994], [42.3363, -83.0434], [42.4132, -83.1969], [42.3895, -83.2274], [42.3836, -83.0823], [42.4289, -83.1099], [42.4289, -83.1098], [42.374, -83.0231], [42.3897, -82.9541], [42.3837, -83.0975], [42.3472, -83.0577], [42.3772, -83.1793], [42.3945, -82.9393], [42.3478, -83.0474], [42.3879, -83.1292], [42.4396, -83.1849], [42.3767, -83.1588], [42.387, -83.1279], [42.3968, -83.0027], [42.3068, -83.1277], [42.4066, -83.2571], [42.3862, -82.9872], [42.435, -82.9776], [42.3587, -83.1036], [42.3863, -82.9631], [42.3657, -83.2264], [42.3674, -83.0845], [42.4171, -83.1487], [42.4435, -83.199], [42.4264, -82.9501], [42.4338, -82.9789], [42.4, -83.2698], [42.434, -82.9787], [42.3803, -82.9943], [42.4443, -82.9723], [42.4357, -83.1451], [42.373, -83.1131], [42.3364, -83.2101], [42.3805, -82.9986], [42.3483, -83.1106], [42.3885, -83.2213], [42.3758, -83.0085], [42.3453, -83.0761], [42.376, -83.1444], [42.3733, -83.1757], [42.3897, -82.9361], [42.3646, -83.0589], [42.3844, -83.0977], [42.4372, -83.224], [42.3236, -83.0939], [42.3448, -83.1019], [42.3479, -83.1997], [42.4296, -83.2332], [42.4328, -83.1856], [42.3433, -83.2286], [42.4311, -82.9686], [42.3312, -83.1294], [42.335, -83.039], [42.4285, -83.0101], [42.351, -83.2409], [42.4008, -83.2191], [42.4406, -83.0208], [42.4367, -82.9864], [42.3323, -83.1286], [42.3279, -83.0617], [42.4339, -82.9822], [42.3827, -82.9839], [42.4138, -83.2575], [42.4333, -82.9458], [42.3532, -82.9921], [42.3584, -83.0488], [42.434, -83.0133], [42.4294, -83.2415], [42.4297, -82.9655], [42.4236, -83.2195], [42.444, -83.2235], [42.4427, -82.9608], [42.4326, -83.0235], [42.4325, -83.0236], [42.441, -83.0244], [42.4489, -83.0051], [42.4488, -83.0052], [42.4431, -82.9629], [42.3089, -83.1247], [42.4279, -83.0467], [42.4001, -83.2206], [42.3774, -83.181], [42.3835, -83.1294], [42.4367, -83.027], [42.4353, -83.1848], [42.3578, -83.1174], [999998.9998, 999998.9999], [42.4347, -82.9898], [42.3051, -83.1298], [42.3228, -83.1009], [42.3382, -83.0426], [42.3654, -83.0058], [42.4048, -83.189], [42.4065, -83.1229], [42.3988, -83.1851], [42.4008, -83.1406], [42.4234, -83.1428], [42.353, -83.1517], [42.3588, -83.1036], [42.4427, -82.963], [42.3395, -83.1072], [42.338, -83.1073], [42.36, -83.0211], [42.3875, -83.1959], [42.4084, -82.939], [42.3356, -83.0409], [42.3891, -83.0973], [42.44, -83.044], [42.3641, -83.2211], [42.3895, -83.1424], [42.3569, -83.1212], [42.343, -83.2306], [42.402, -82.9732], [42.4199, -82.9146], [42.4171, -83.1512], [42.4296, -82.9813], [42.3551, -83.2385], [42.3313, -83.1099], [42.3313, -83.1099], [42.3526, -83.2327], [42.4449, -83.1835], [42.3691, -82.9963], [42.414, -83.1458], [42.3454, -83.2381], [42.3823, -83.1501], [42.4212, -83.2016], [42.4124, -83.2749], [42.4424, -83.2274], [42.4382, -83.091], [42.3375, -83.1442], [42.3994, -83.2145], [42.3859, -83.2466], [42.4096, -83.1805], [42.338, -83.2017], [42.3652, -83.1972], [42.4009, -83.2687], [42.3872, -83.1171], [42.3677, -83.0847], [42.413, -83.2444], [42.4185, -83.2847], [42.3755, -83.1892], [42.3624, -83.0019], [42.3803, -83.1328], [42.423, -82.9544], [42.4126, -82.9422], [42.4424, -82.9742], [42.4196, -83.1125], [42.4066, -83.2446], [42.3603, -83.0998], [42.3934, -83.2459], [42.3352, -83.2214], [42.412, -82.9333], [42.3863, -83.2484], [42.3862, -83.2483], [42.4023, -83.1545], [42.374, -82.9612], [42.3747, -83.1416], [42.3545, -83.2395], [42.4028, -83.1992], [42.3581, -83.2018], [42.3836, -83.1978], [42.3871, -83.1245], [42.3899, -83.0924], [42.4361, -83.1967], [42.4141, -83.181], [42.3701, -83.0757], [42.3236, -83.0975], [42.3814, -82.9473], [42.3577, -83.2166], [42.3304, -83.1443], [42.3879, -83.2569], [42.4369, -83.1894], [42.3542, -83.1219], [42.3528, -83.1376], [42.3581, -83.2014], [42.4194, -82.9603], [42.3601, -83.1973], [42.3702, -83.2451], [42.368, -82.9514], [42.4223, -82.9673], [42.4182, -83.1391], [42.4091, -82.9861], [42.393, -83.2395], [42.4232, -82.9528], [42.4273, -83.1706], [42.3744, -83.161], [42.428, -82.946], [42.4436, -82.9719], [42.3996, -83.1979], [42.4075, -83.2753], [42.3596, -83.1385], [42.3312, -83.1311], [42.3775, -83.0872], [42.401, -83.2222], [42.3401, -83.2208], [42.3805, -83.2626], [42.356, -83.1648], [42.4271, -82.9587], [42.4269, -82.9588], [42.4135, -82.9482], [42.3534, -83.1537], [42.4276, -82.9825], [42.4232, -83.1526], [42.3715, -83.1982], [42.3349, -83.0324], [42.344, -83.0644], [42.423, -82.9488], [42.4218, -82.9868], [42.4259, -83.1712], [42.4139, -83.1473], [42.4282, -83.2074], [42.3597, -83.0663], [42.4295, -83.2389], [42.3521, -82.9939], [42.416, -82.9558], [42.3364, -83.1251], [42.3649, -83.0115], [42.3845, -83.1126], [42.4473, -83.0333], [42.4235, -83.241], [42.3347, -83.0452], [42.3583, -83.1989], [42.3872, -82.9481], [42.4231, -82.9893], [42.4429, -82.9978], [999999.0001, 999998.9998], [42.4329, -83.0827], [42.3898, -83.0154], [42.4102, -82.9317], [42.351, -83.0248], [42.4292, -83.2107], [42.4083, -83.2335], [42.4127, -83.1697], [42.3855, -83.2067], [42.3675, -83.0982], [42.3744, -83.1318], [42.4118, -82.9377], [42.4276, -83.0495], [42.4411, -83.1372], [42.3054, -83.124], [42.4415, -83.0048], [42.3729, -83.188], [42.406, -83.1273], [42.4353, -83.0084], [42.4166, -82.9602], [42.4191, -83.2401], [42.3762, -83.0273], [42.4304, -83.0921], [42.4049, -82.9492], [42.3988, -82.939], [42.4351, -83.073], [42.358, -82.9852], [42.3624, -83.1646], [42.3565, -83.162], [42.3715, -83.074], [42.4394, -83.1338], [42.3809, -83.125], [42.3658, -83.0851], [42.3342, -83.0939], [42.417, -82.9105], [42.4329, -83.063], [42.4344, -82.9751], [42.3322, -83.1236], [42.4227, -83.1706], [42.3555, -83.14], [42.3528, -83.1193], [42.3328, -83.0509], [42.4042, -83.2392], [42.3842, -83.213], [42.4082, -83.0511], [42.3944, -83.1156], [42.4177, -82.9555], [42.4179, -82.9552], [999999.0, 999999.0], [42.4309, -83.0954], [42.3087, -83.1363], [42.4104, -83.0709], [42.367, -83.1015], [42.4182, -83.131], [42.4019, -82.9733], [42.3648, -82.9754], [42.3731, -83.076], [42.3287, -83.0514], [42.374, -83.2366], [42.3418, -83.1024], [42.3292, -83.0507], [42.3401, -83.2134], [42.3101, -83.1299], [42.356, -83.0665], [42.4063, -83.053], [42.3592, -82.9845], [42.3787, -83.0824], [42.3727, -83.1327], [42.3324, -83.0293], [42.3721, -82.9381], [42.4154, -83.0462], [42.4212, -82.9657], [42.2666, -83.1542], [42.3759, -83.153], [42.3479, -83.2383], [42.3518, -83.0605], [42.3676, -83.0844], [42.3678, -83.0846], [42.4132, -83.1445], [42.3982, -82.9514], [42.3366, -83.0261], [42.3522, -83.138], [42.4456, -83.0477], [42.3832, -82.9637], [42.3527, -83.1926], [42.3929, -83.1219], [42.4355, -83.0222], [42.4054, -83.1514], [42.4146, -83.2169], [42.4055, -82.9964], [42.4446, -83.1659], [42.309, -83.0979], [42.3166, -83.1042], [42.3874, -83.1886], [42.3324, -83.0641], [42.425, -83.2199], [42.4409, -83.2279], [42.4118, -83.2818], [42.3432, -83.2123], [42.3938, -83.201], [42.3155, -83.1099], [42.428, -82.9619], [42.4026, -83.1549], [42.4442, -83.1803], [42.4254, -83.2792], [42.3362, -83.0524], [42.4299, -83.2349], [42.3245, -83.0565], [42.3135, -83.1084], [42.3948, -83.1585], [42.3881, -83.0774], [42.4187, -82.9865], [42.3328, -83.149], [42.308, -83.0955], [42.3081, -83.0954], [42.4187, -83.2849], [42.3452, -83.0568], [42.4178, -82.9552], [42.4061, -83.2517], [42.412, -83.1409], [42.3608, -83.1382], [42.3812, -82.9504], [42.417, -83.0055], [42.3365, -83.1382], [42.3548, -83.2435], [42.4173, -82.9372], [42.3652, -83.1984], [42.4375, -82.9793], [42.3677, -83.0845], [42.4466, -83.1251], [42.3301, -83.0456], [42.4348, -83.0832], [42.3677, -83.0844], [42.3714, -83.0196], [42.3992, -82.9689], [42.3649, -83.0077], [42.433, -82.9668], [42.4046, -83.0474], [42.3497, -83.0592], [42.3796, -82.9831], [42.4316, -83.2794], [42.4472, -83.0834], [42.3528, -83.0798], [42.4492, -82.9565], [42.4359, -83.0096], [42.2912, -83.126], [42.4323, -83.1106], [42.399, -83.0012], [42.3963, -83.2068], [42.3624, -83.2399], [42.3324, -83.0416], [42.3595, -83.1385], [42.4368, -83.0984], [42.4234, -83.2577], [42.3828, -83.2572], [42.3913, -83.185], [42.4474, -83.0356], [42.3376, -83.0626], [42.3211, -83.1042], [42.376, -83.14], [42.4172, -82.9895], [42.3756, -83.2318], [42.3469, -83.0855], [42.4089, -83.1575], [42.4146, -82.9709], [42.4347, -82.9746], [42.379, -83.0802], [42.4472, -83.0832], [42.3787, -82.9419], [42.3844, -83.1181], [42.4431, -82.9606], [42.3031, -83.1361], [42.3936, -83.2007], [42.3192, -83.1083], [42.4445, -83.0326], [42.3658, -83.2102], [42.3936, -83.2008], [42.4181, -83.258], [42.402, -82.941], [42.3541, -83.1262], [42.4338, -82.9686], [42.402, -82.9678], [42.3701, -83.0897], [42.4306, -83.2056], [42.3118, -83.1264], [42.4458, -82.9645], [42.4314, -83.1414], [42.4085, -82.9951], [42.3334, -83.2279], [42.3982, -83.1849], [42.4083, -83.2685], [42.4099, -83.2213], [42.4312, -83.2432], [42.347, -83.05], [42.3979, -83.1751], [42.3595, -82.984], [42.4449, -83.1326], [42.3661, -83.2213], [42.4264, -82.9954], [42.4164, -83.2576], [42.4004, -83.1684], [42.3401, -83.0412], [42.4373, -83.0103], [42.34, -83.0412], [42.3407, -83.0479], [42.3434, -83.0388], [42.3396, -83.2302], [42.339, -83.0466], [42.4314, -83.1609], [42.3357, -83.0479], [42.3537, -83.0594], [42.4314, -82.9434], [42.3378, -83.0627], [42.3504, -83.2301], [42.3416, -83.1435], [42.3756, -82.9955], [42.4204, -83.0031], [42.3446, -83.0506], [42.3368, -83.0528], [42.3333, -83.0456], [42.4127, -83.275], [42.3417, -83.0683], [42.3371, -83.0418], [42.4025, -83.1595], [42.4452, -83.0009], [42.3325, -83.0407], [42.3764, -83.1285], [42.3316, -83.0433], [42.4187, -83.0637], [42.34, -83.0552], [42.3792, -83.0703], [42.3325, -83.0581], [42.4114, -83.2091], [42.3687, -83.1003], [42.4144, -82.971], [42.3496, -83.063], [42.3412, -83.0146], [42.343, -83.077], [42.3981, -83.1877], [42.4148, -83.2826], [42.3519, -83.0648], [42.4297, -83.2387], [42.4084, -82.9743], [42.4278, -82.9508], [42.3676, -83.0384], [42.388, -83.0735], [42.3292, -83.0478], [42.4155, -83.2047], [42.3445, -83.0505], [42.4163, -83.0044], [42.3444, -83.0504], [42.3566, -83.2399], [42.3514, -83.0651], [42.3363, -83.2067], [42.3446, -83.0504], [42.4148, -82.9685], [42.4377, -83.2137], [42.3442, -83.0358], [42.3561, -83.1787], [42.3562, -83.1786], [42.3368, -83.137], [42.4364, -83.0043], [42.4074, -82.9458], [42.4404, -83.005], [42.3385, -83.0466], [42.384, -83.1185], [42.3553, -83.0541], [42.3564, -83.2244], [42.3407, -83.0409], [42.4469, -83.0835], [42.3547, -83.2298], [42.3232, -83.0947], [42.3363, -83.2318], [42.4372, -82.9957], [42.4099, -82.9389], [42.3367, -83.0556], [42.3849, -83.0658], [42.4433, -83.1625], [42.4335, -83.0435], [42.4145, -82.977], [42.442, -83.2012], [42.389, -82.9772], [42.3691, -83.0889], [42.3744, -83.1759], [42.3135, -83.1038], [42.3844, -83.2431], [42.3309, -83.1503], [42.4354, -83.0797], [42.341, -83.0402], [42.4279, -83.187], [42.3798, -83.115], [42.3435, -83.0836], [42.3388, -83.2098], [42.3787, -82.9986], [42.3365, -83.1211], [42.4467, -82.9604], [42.371, -82.9496], [42.3183, -83.1032], [42.3937, -83.2013], [42.4458, -82.9677], [42.4302, -83.0831], [42.3475, -83.2044], [999999.0, 999999.0001], [42.4299, -83.1721], [42.3162, -83.0931], [42.3776, -82.9412], [42.4305, -82.9521], [42.3375, -83.0511], [42.3996, -82.9817], [42.4281, -83.1868], [42.3443, -83.0503], [42.3877, -83.0964], [42.4201, -83.18], [42.4294, -83.1694], [42.3681, -83.022], [42.4072, -82.9376], [42.3645, -83.2211], [42.4126, -83.1716], [42.4312, -82.9651], [42.3995, -83.2376], [42.4429, -83.0623], [42.3378, -83.1277], [42.3979, -83.2553], [42.3989, -83.1945], [42.4145, -82.971], [42.3999, -83.1886], [42.4297, -83.2387], [42.4459, -83.1427], [42.3322, -83.1524], [42.4257, -83.2257], [42.389, -82.9775], [42.4121, -83.2854], [42.3433, -83.2123], [42.4211, -83.0836], [42.3195, -83.089], [42.3504, -83.0601], [42.3916, -82.9434], [42.423, -83.2615], [42.3484, -83.0511], [42.4438, -83.1409], [42.389, -83.1964]];
    var heatmapData = [];

    for (var i = 0; i < points; ++i) {
        var lat = crimeData[i][0];
        var lng = crimeData[i][1];
        heatmapData.push(new google.maps.LatLng(lat, lng));
    }
    return heatmapData;
}

function load100() {
    heatmap.setMap(null);
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: getPoints(100),
        map: map,
        radius: 20
    });
}

function load500() {
    heatmap.setMap(null);
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: getPoints(500),
        map: map,
        radius: 20,
        maxIntensity: 4
    });
}

function load1000() {
    heatmap.setMap(null);
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: getPoints(1000),
        map: map,
        radius: 20,
        maxIntensity: 7
    });
}

function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
}

function placeMarker(position, map) {
    var marker = new google.maps.Marker({
        position: position,
        map: map
    });
}

function togglePolice() {
    for (var i = 0; i < policeStations.length; ++i) {
        if (!policeStations[i].visible) {
            policeStations[i].setVisible(true);
        } else {
            policeStations[i].setVisible(false);
        }
    }
}

function toggleLibraries() {
    for (var i = 0; i < libraries.length; ++i) {
        if (!libraries[i].visible) {
            libraries[i].setVisible(true);
        } else {
            libraries[i].setVisible(false);
        }
    }
}

function findRoute() {
    var request = {
        origin: start,
        destination: end,
        provideRouteAlternatives: true,
        travelMode: google.maps.TravelMode.WALKING
    };
    directionsService.route(request, function(result, status) {
        if (status == 'OK') {
            var routes = result.routes;
            directionsDisplay.setDirections(result);
            var directionsRenderer1 = new google.maps.DirectionsRenderer({
                directions: result,
                routeIndex: 0,
                map: map,
                polylineOptions: {
                    strokeColor: "green"
                }
            });
            var directionsRenderer2 = new google.maps.DirectionsRenderer({
                directions: result,
                routeIndex: 1,
                map: map,
                polylineOptions: {
                    strokeColor: "blue"
                }
            });
            var directionsRenderer3 = new google.maps.DirectionsRenderer({
                directions: result,
                routeIndex: 2,
                map: map,
                polylineOptions: {
                    strokeColor: "red"
                }
            });
        } else {
            alert("couldn't get directions:" + status);
        }
    });
}

function geoLocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            currentLat = position.coords.latitude;
            currentLong = position.coords.longitude;

            if (currentLat && currentLong) {
                $.post("/update_location", {"lat": currentLat, "lng": currentLong});
            }

            if (google) {
                if (myMarker) {
                    myMarker.setMap(null);
                }
                myMarker = dropPin(currentLat, currentLong, fb_img);
            }
        }, function() {
            handleLocationError(true);
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false);
    }

    function handleLocationError(browserHasGeolocation) {
        console.log(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    }
}

function dropPin(lat, lng, img) {
    position = new google.maps.LatLng(lat, lng);
    var marker = new google.maps.Marker({
        position: position,
        map: map,
        icon: img
    });
    return marker;
}

function findBuddies() {
    // Receive buddy data [GET id, lat, lng, time, name, picture]
    $.get("/get_friends", function(json) {
        for (var i = 0; i < buddyMarkers.length; ++i) {
            buddyMarkers[i].setMap(null);
        }
        var data = jQuery.parseJSON(json);
        for (var i = 0; i < data.length; ++i) {
            var lat = data[i].lat;
            var lng = data[i].lng;
            var name = data[i].name;
            var pic = data[i].picture;
            buddyMarkers.push(dropPin(lat, lng, pic));
        }
    });
}
// Every 10 seconds, updates user location. [POST {id, lat, lng]
function update_loc() {
    geoLocate();
    findBuddies();
}

setInterval(update_loc,10000);

function stop_update_loc() {
    clearInterval();
}

