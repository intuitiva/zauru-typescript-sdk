"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMunSelectOptions = exports.getDepSelectOptions = exports.guatemalaCountryInfo = void 0;
exports.guatemalaCountryInfo = [
    { value: 0, label: "GUATEMALA,GUATEMALA" },
    {
        value: 1,
        label: "GUATEMALA,SANTA CATARINA PINULA",
    },
    { value: 2, label: "GUATEMALA,SAN JOSÉ PINULA" },
    {
        value: 3,
        label: "GUATEMALA,SAN JOSÉ DEL GOLFO",
    },
    { value: 4, label: "GUATEMALA,PALENCIA" },
    { value: 5, label: "GUATEMALA,CHINAUTLA" },
    {
        value: 6,
        label: "GUATEMALA,SAN PEDRO AYAMPUC",
    },
    { value: 7, label: "GUATEMALA,MIXCO" },
    {
        value: 8,
        label: "GUATEMALA,SAN PEDRO SACATEPÉQUEZ",
    },
    {
        value: 9,
        label: "GUATEMALA,SAN JUAN SACATEPÉQUEZ",
    },
    { value: 10, label: "GUATEMALA,SAN RAYMUNDO" },
    { value: 11, label: "GUATEMALA,CHUARRANCHO" },
    { value: 12, label: "GUATEMALA,FRAIJANES" },
    { value: 13, label: "GUATEMALA,AMATITLÁN" },
    { value: 14, label: "GUATEMALA,VILLA NUEVA" },
    { value: 15, label: "GUATEMALA,VILLA CANALES" },
    {
        value: 16,
        label: "GUATEMALA,SAN MIGUEL PETAPA",
    },
    { value: 17, label: "EL PROGRESO,GUASTATOYA" },
    { value: 18, label: "EL PROGRESO,MORAZÁN" },
    {
        value: 19,
        label: "EL PROGRESO,SAN AGUSTÍN ACASAGUASTLÁN",
    },
    {
        value: 20,
        label: "EL PROGRESO,SAN CRISTÓBAL ACASAGUASTLÁN",
    },
    { value: 21, label: "EL PROGRESO,EL JICARO" },
    { value: 22, label: "EL PROGRESO,SANSARE" },
    { value: 23, label: "EL PROGRESO,SANARATE" },
    {
        value: 24,
        label: "EL PROGRESO,SAN ANTONIO LA PAZ",
    },
    {
        value: 25,
        label: "SACATEPÉQUEZ,ANTIGUA GUATEMALA",
    },
    { value: 26, label: "SACATEPÉQUEZ,JOCOTENANGO" },
    { value: 27, label: "SACATEPÉQUEZ,PASTORES" },
    { value: 28, label: "SACATEPÉQUEZ,SUMPANGO" },
    {
        value: 29,
        label: "SACATEPÉQUEZ,SANTO DOMINGO XENACOJ",
    },
    {
        value: 30,
        label: "SACATEPÉQUEZ,SANTIAGO SACATEPÉQUEZ",
    },
    {
        value: 31,
        label: "SACATEPÉQUEZ,SAN BARTÓLOME MILPAS ALTAS",
    },
    {
        value: 32,
        label: "SACATEPÉQUEZ,SAN LUCAS SACATEPÉQUEZ",
    },
    {
        value: 33,
        label: "SACATEPÉQUEZ,SANTA LUCÍA MILPAS ALTAS",
    },
    {
        value: 34,
        label: "SACATEPÉQUEZ,MAGDALENA MILPAS ALTAS",
    },
    {
        value: 35,
        label: "SACATEPÉQUEZ,SANTA MARÍA DE JESÚS",
    },
    { value: 36, label: "SACATEPÉQUEZ,CIUDAD VIEJA" },
    {
        value: 37,
        label: "SACATEPÉQUEZ,SAN MIGUEL DUEÑAS",
    },
    { value: 38, label: "SACATEPÉQUEZ,ALOTENANGO" },
    {
        value: 39,
        label: "SACATEPÉQUEZ,SAN ANTONIO AGUAS CALIENTES",
    },
    {
        value: 40,
        label: "SACATEPÉQUEZ,SANTA CATARINA BARAHONA",
    },
    {
        value: 41,
        label: "SACATEPÉQUEZ,SANTO TOMAS MILPAS ALTAS",
    },
    {
        value: 42,
        label: "SACATEPÉQUEZ,SAN PEDRO LAS HUERTAS",
    },
    {
        value: 43,
        label: "SACATEPÉQUEZ,SANTA MARIA CAUQUE",
    },
    {
        value: 44,
        label: "CHIMALTENANGO,CHIMALTENANGO",
    },
    {
        value: 45,
        label: "CHIMALTENANGO,SAN JOSÉ POAQUIL",
    },
    {
        value: 46,
        label: "CHIMALTENANGO,SAN MARTÍN JILOTEPEQUE",
    },
    { value: 47, label: "CHIMALTENANGO,COMALAPA" },
    {
        value: 48,
        label: "CHIMALTENANGO,SANTA APOLONIA",
    },
    {
        value: 49,
        label: "CHIMALTENANGO,TECPÁN GUATEMALA",
    },
    { value: 50, label: "CHIMALTENANGO,PATZÚN" },
    { value: 51, label: "CHIMALTENANGO,POCHUTA" },
    { value: 52, label: "CHIMALTENANGO,PATZICIA" },
    {
        value: 53,
        label: "CHIMALTENANGO,SANTA CRUZ BALANYA",
    },
    { value: 54, label: "CHIMALTENANGO,ACATENANGO" },
    { value: 55, label: "CHIMALTENANGO,YEPOCAPA" },
    {
        value: 56,
        label: "CHIMALTENANGO,SAN ANDRÉS ITZAPA",
    },
    { value: 57, label: "CHIMALTENANGO,PARRAMOS" },
    { value: 58, label: "CHIMALTENANGO,ZARAGOZA" },
    { value: 59, label: "CHIMALTENANGO,EL TEJAR" },
    {
        value: 60,
        label: "CHIMALTENANGO,ALDEA CHIMACHOY, ITZAPA",
    },
    { value: 61, label: "ESCUINTLA,ESCUINTLA" },
    {
        value: 62,
        label: "ESCUINTLA,SANTA  LUCIA COTZUMALGUAPA",
    },
    { value: 63, label: "ESCUINTLA,LA DEMOCRACIA" },
    { value: 64, label: "ESCUINTLA,SIQUINALA" },
    { value: 65, label: "ESCUINTLA,MASAGUA" },
    { value: 66, label: "ESCUINTLA,TIQUISATE" },
    { value: 67, label: "ESCUINTLA,LA GOMERA" },
    { value: 68, label: "ESCUINTLA,GUANAGAZAPA" },
    { value: 69, label: "ESCUINTLA,SAN JOSE" },
    { value: 70, label: "ESCUINTLA,IZTAPA" },
    { value: 71, label: "ESCUINTLA,PALÍN" },
    {
        value: 72,
        label: "ESCUINTLA,SAN VICENTE PACAYA",
    },
    {
        value: 73,
        label: "ESCUINTLA,NUEVA CONCEPCIÓN",
    },
    { value: 74, label: "ESCUINTLA,SIPACATE" },
    { value: 75, label: "SANTA ROSA,CUILAPA" },
    { value: 76, label: "SANTA ROSA,BARBERENA" },
    {
        value: 77,
        label: "SANTA ROSA,SANTA ROSA DE LIMA",
    },
    { value: 78, label: "SANTA ROSA,CASILLAS" },
    {
        value: 79,
        label: "SANTA ROSA,SAN RAFAEL LAS FLORES",
    },
    { value: 80, label: "SANTA ROSA,ORATORIO" },
    {
        value: 81,
        label: "SANTA ROSA,SAN JUAN TECUACO",
    },
    { value: 82, label: "SANTA ROSA,CHIQUIMULILLA" },
    { value: 83, label: "SANTA ROSA,TAXISCO" },
    {
        value: 84,
        label: "SANTA ROSA,SANTA MARIA IXHUATÁN",
    },
    { value: 85, label: "SANTA ROSA,GUAZACAPÁN" },
    {
        value: 86,
        label: "SANTA ROSA,SANTA CRUZ EL NARANJO",
    },
    {
        value: 87,
        label: "SANTA ROSA,PUEBLO NUEVO VIÑAS",
    },
    {
        value: 88,
        label: "SANTA ROSA,NUEVA SANTA ROSA",
    },
    { value: 89, label: "SOLOLÁ,SOLOLÁ" },
    { value: 90, label: "SOLOLÁ,SAN JOSÉ CHACAYA" },
    {
        value: 91,
        label: "SOLOLÁ,SANTA MARÍA VISITACIÓN",
    },
    {
        value: 92,
        label: "SOLOLÁ,SANTA LUCIA UTATLÁN",
    },
    { value: 93, label: "SOLOLÁ,NAHUALA" },
    {
        value: 94,
        label: "SOLOLÁ,SANTA CATARINA IXTAHUACÁN",
    },
    {
        value: 95,
        label: "SOLOLÁ,SANTA CLARA LA LAGUNA",
    },
    { value: 96, label: "SOLOLÁ,CONCEPCIÓN" },
    {
        value: 97,
        label: "SOLOLÁ,SAN ANDRES SEMETABAJ",
    },
    { value: 98, label: "SOLOLÁ,PANAJACHEL" },
    {
        value: 99,
        label: "SOLOLÁ,SANTA CATARINA PALOPO",
    },
    {
        value: 100,
        label: "SOLOLÁ,SAN ANTONIO PALOPO",
    },
    { value: 101, label: "SOLOLÁ,SAN LUCAS TOLIMÁN" },
    {
        value: 102,
        label: "SOLOLÁ,SANTA CRUZ LA LAGUNA",
    },
    {
        value: 103,
        label: "SOLOLÁ,SAN PABLO LA LAGUNA",
    },
    {
        value: 104,
        label: "SOLOLÁ,SAN MARCOS LA LAGUNA",
    },
    {
        value: 105,
        label: "SOLOLÁ,SAN JUAN LA LAGUNA",
    },
    {
        value: 106,
        label: "SOLOLÁ,SAN PEDRO LA LAGUNA",
    },
    { value: 107, label: "SOLOLÁ,SANTIAGO ATITLÁN" },
    {
        value: 108,
        label: "SOLOLÁ,SANTA MARIA VISITACIÓN",
    },
    { value: 109, label: "SOLOLÁ,CONCEPCIÓN" },
    { value: 110, label: "SOLOLÁ,CANTÓN CHICHIMUCH" },
    { value: 111, label: "TOTONICAPÁN,TOTONICAPÁN" },
    {
        value: 112,
        label: "TOTONICAPÁN,SAN CRISTÓBAL TOTONICAPÁN",
    },
    {
        value: 113,
        label: "TOTONICAPÁN,SAN FRANCISCO EL ALTO",
    },
    {
        value: 114,
        label: "TOTONICAPÁN,SAN ANDRÉS XECUL",
    },
    { value: 115, label: "TOTONICAPÁN,MOMOSTENANGO" },
    {
        value: 116,
        label: "TOTONICAPÁN,SANTA MARIA CHIQUIMULA",
    },
    {
        value: 117,
        label: "TOTONICAPÁN,SANTA LUCIA LA REFORMA",
    },
    { value: 118, label: "TOTONICAPÁN,SAN BARTÓLO" },
    {
        value: 119,
        label: "QUETZALTENANGO,QUETZALTENANGO",
    },
    { value: 120, label: "QUETZALTENANGO,SALCAJÁ" },
    {
        value: 121,
        label: "QUETZALTENANGO,OLINTEPEQUE",
    },
    {
        value: 122,
        label: "QUETZALTENANGO,SAN CARLOS SIJA",
    },
    { value: 123, label: "QUETZALTENANGO,SIBILIA" },
    { value: 124, label: "QUETZALTENANGO,CABRICAN" },
    { value: 125, label: "QUETZALTENANGO,CAJOLÁ" },
    {
        value: 126,
        label: "QUETZALTENANGO,SAN MIGUEL SIGILA",
    },
    {
        value: 127,
        label: "QUETZALTENANGO,OSTUNCALCO",
    },
    { value: 128, label: "QUETZALTENANGO,SAN MATEO" },
    {
        value: 129,
        label: "QUETZALTENANGO,CONCEPCIÓN CHIQUIRICHAPA",
    },
    {
        value: 130,
        label: "QUETZALTENANGO,SAN  MARTÍN SACATEPÉQUEZ",
    },
    { value: 131, label: "QUETZALTENANGO,ALMOLONGA" },
    { value: 132, label: "QUETZALTENANGO,CANTEL" },
    { value: 133, label: "QUETZALTENANGO,HUITAN" },
    { value: 134, label: "QUETZALTENANGO,ZUNIL" },
    { value: 135, label: "QUETZALTENANGO,COLOMBA" },
    {
        value: 136,
        label: "QUETZALTENANGO,SAN FRANCISCO LA UNIÓN",
    },
    { value: 137, label: "QUETZALTENANGO,EL PALMAR" },
    {
        value: 138,
        label: "QUETZALTENANGO,COATEPEQUE",
    },
    { value: 139, label: "QUETZALTENANGO,GENOVA" },
    {
        value: 140,
        label: "QUETZALTENANGO,FLORES COSTA CUCA",
    },
    {
        value: 141,
        label: "QUETZALTENANGO,LA ESPERANZA",
    },
    {
        value: 142,
        label: "QUETZALTENANGO,PALESTINA DE LOS ALTOS",
    },
    {
        value: 143,
        label: "SUCHITEPÉQUEZ,MAZATENANGO",
    },
    {
        value: 144,
        label: "SUCHITEPÉQUEZ,CUYOTENANGO",
    },
    {
        value: 145,
        label: "SUCHITEPÉQUEZ,SAN FRANCISCO ZAPOTITLÁN",
    },
    {
        value: 146,
        label: "SUCHITEPÉQUEZ,SAN BERNARDINO",
    },
    {
        value: 147,
        label: "SUCHITEPÉQUEZ,SAN JOSÉ EL ÍDOLO",
    },
    {
        value: 148,
        label: "SUCHITEPÉQUEZ,SANTO DOMINGO SUCHITEPÉQUEZ",
    },
    {
        value: 149,
        label: "SUCHITEPÉQUEZ,SAN LORENZO",
    },
    { value: 150, label: "SUCHITEPÉQUEZ,SAMAYAC" },
    {
        value: 151,
        label: "SUCHITEPÉQUEZ,SAN PABLO JOCOPILAS",
    },
    {
        value: 152,
        label: "SUCHITEPÉQUEZ,SAN ANTONIO SUCHITEPÉQUEZ",
    },
    {
        value: 153,
        label: "SUCHITEPÉQUEZ,SAN MIGUEL PANÁM",
    },
    {
        value: 154,
        label: "SUCHITEPÉQUEZ,SAN GABRIEL",
    },
    { value: 155, label: "SUCHITEPÉQUEZ,CHICACAO" },
    { value: 156, label: "SUCHITEPÉQUEZ,PATULUL" },
    {
        value: 157,
        label: "SUCHITEPÉQUEZ,SANTA BARBARA",
    },
    {
        value: 158,
        label: "SUCHITEPÉQUEZ,SAN JUAN BAUTISTA",
    },
    {
        value: 159,
        label: "SUCHITEPÉQUEZ,SANTO TOMAS LA UNIÓN",
    },
    { value: 160, label: "SUCHITEPÉQUEZ,ZUNILITO" },
    {
        value: 161,
        label: "SUCHITEPÉQUEZ,PUEBLO NUEVO",
    },
    { value: 162, label: "SUCHITEPÉQUEZ,RIO BRAVO" },
    {
        value: 163,
        label: "SUCHITEPÉQUEZ,SAN PEDRO JOCOPILAS",
    },
    {
        value: 164,
        label: "SUCHITEPÉQUEZ,SAN JOSÉ LA MÁQUINA",
    },
    { value: 165, label: "RETALHULEU,RETALHULEU" },
    { value: 166, label: "RETALHULEU,SAN SEBASTIÁN" },
    {
        value: 167,
        label: "RETALHULEU,SANTA CRUZ MULUÁ",
    },
    {
        value: 168,
        label: "RETALHULEU,SAN MARTIN ZAPOTITLÁN",
    },
    { value: 169, label: "RETALHULEU,SAN FELIPE" },
    {
        value: 170,
        label: "RETALHULEU,SAN ANDRÉS VILLA SECA",
    },
    { value: 171, label: "RETALHULEU,CHAMPERICO" },
    {
        value: 172,
        label: "RETALHULEU,NUEVO SAN CARLOS",
    },
    { value: 173, label: "RETALHULEU,EL ASINTAL" },
    { value: 174, label: "SAN MARCOS,SAN MARCOS" },
    {
        value: 175,
        label: "SAN MARCOS,SAN PEDRO SACATEPÉQUEZ",
    },
    {
        value: 176,
        label: "SAN MARCOS,SAN ANTONIO SACATEPÉQUEZ",
    },
    { value: 177, label: "SAN MARCOS,COMITANCILLO" },
    {
        value: 178,
        label: "SAN MARCOS,SAN MIGUEL IXTAHUACÁN",
    },
    {
        value: 179,
        label: "SAN MARCOS,CONCEPCIÓN TUTUAPA",
    },
    { value: 180, label: "SAN MARCOS,TACANÁ" },
    { value: 181, label: "SAN MARCOS,SIBINAL" },
    { value: 182, label: "SAN MARCOS,TAJUMULCO" },
    { value: 183, label: "SAN MARCOS,TEJUTLA" },
    {
        value: 184,
        label: "SAN MARCOS,SAN RAFAEL PIE DE LA CUESTA",
    },
    {
        value: 185,
        label: "SAN MARCOS,NUEVO PROGRESO",
    },
    { value: 186, label: "SAN MARCOS,EL TUMBADOR" },
    { value: 187, label: "SAN MARCOS,EL RODEO" },
    { value: 188, label: "SAN MARCOS,MALACATÁN" },
    { value: 189, label: "SAN MARCOS,CATARINA" },
    { value: 190, label: "SAN MARCOS,AYUTLA" },
    { value: 191, label: "SAN MARCOS,OCOS" },
    { value: 192, label: "SAN MARCOS,SAN PABLO" },
    { value: 193, label: "SAN MARCOS,EL QUETZAL" },
    { value: 194, label: "SAN MARCOS,LA REFORMA" },
    { value: 195, label: "SAN MARCOS,PAJAPITA" },
    { value: 196, label: "SAN MARCOS,IXCHIGUÁN" },
    {
        value: 197,
        label: "SAN MARCOS,SAN JOSÉ OJETENAM",
    },
    {
        value: 198,
        label: "SAN MARCOS,SAN CRISTÓBAL CUCHO",
    },
    { value: 199, label: "SAN MARCOS,SIPACAPA" },
    {
        value: 200,
        label: "SAN MARCOS,ESQUIPULAS  PALO GORDO",
    },
    { value: 201, label: "SAN MARCOS,RÍO BLANCO" },
    { value: 202, label: "SAN MARCOS,SAN LORENZO" },
    { value: 203, label: "SAN MARCOS,LA BLANCA" },
    {
        value: 204,
        label: "HUEHUETENANGO,HUEHUETENANGO",
    },
    { value: 205, label: "HUEHUETENANGO,CHIANTLA" },
    {
        value: 206,
        label: "HUEHUETENANGO,MALACATANCITO",
    },
    { value: 207, label: "HUEHUETENANGO,CUILCO" },
    { value: 208, label: "HUEHUETENANGO,NENTÓN" },
    {
        value: 209,
        label: "HUEHUETENANGO,SAN PEDRO NECTA",
    },
    {
        value: 210,
        label: "HUEHUETENANGO,JACALTENANGO",
    },
    { value: 211, label: "HUEHUETENANGO,SOLOMA" },
    { value: 212, label: "HUEHUETENANGO,IXTAHUACÁN" },
    {
        value: 213,
        label: "HUEHUETENANGO,SANTA BARBARA",
    },
    {
        value: 214,
        label: "HUEHUETENANGO,LA LIBERTAD",
    },
    {
        value: 215,
        label: "HUEHUETENANGO,LA DEMOCRACIA",
    },
    {
        value: 216,
        label: "HUEHUETENANGO,SAN MIGUEL ACATÁN",
    },
    {
        value: 217,
        label: "HUEHUETENANGO,SAN RAFAEL LA INDEPENDENCIA",
    },
    {
        value: 218,
        label: "HUEHUETENANGO,TODOS LOS SANTOS CUCHUMATANES",
    },
    {
        value: 219,
        label: "HUEHUETENANGO,SAN JUAN ATITÁN",
    },
    {
        value: 220,
        label: "HUEHUETENANGO,SANTA EULALIA",
    },
    {
        value: 221,
        label: "HUEHUETENANGO,SAN MATEO IXTATÁN",
    },
    {
        value: 222,
        label: "HUEHUETENANGO,COLOTENANGO",
    },
    {
        value: 223,
        label: "HUEHUETENANGO,SAN SEBASTIÁN HUEHUETENANGO",
    },
    { value: 224, label: "HUEHUETENANGO,TECTITÁN" },
    {
        value: 225,
        label: "HUEHUETENANGO,CONCEPCIÓN HUISTA",
    },
    {
        value: 226,
        label: "HUEHUETENANGO,SAN  JUAN IXCOY",
    },
    {
        value: 227,
        label: "HUEHUETENANGO,SAN ANTONIO HUISTA",
    },
    {
        value: 228,
        label: "HUEHUETENANGO,SAN SEBASTIÁN COATAN",
    },
    { value: 229, label: "HUEHUETENANGO,BARILLAS" },
    { value: 230, label: "HUEHUETENANGO,AGUACATÁN" },
    {
        value: 231,
        label: "HUEHUETENANGO,SAN RAFAEL PETZAL",
    },
    {
        value: 232,
        label: "HUEHUETENANGO,SAN GASPAR IXCHIL",
    },
    {
        value: 233,
        label: "HUEHUETENANGO,SANTIAGO CHIMALTENANGO",
    },
    {
        value: 234,
        label: "HUEHUETENANGO,SANTA ANA HUISTA",
    },
    {
        value: 235,
        label: "HUEHUETENANGO,SANTA  CRUZ BARILLAS",
    },
    {
        value: 236,
        label: "HUEHUETENANGO,UNIÓN CANTINIL",
    },
    { value: 237, label: "HUEHUETENANGO,PETATÁN" },
    {
        value: 238,
        label: "QUICHÉ,SANTA CRUZ DEL QUICHÉ",
    },
    { value: 239, label: "QUICHÉ,CHICHÉ" },
    { value: 240, label: "QUICHÉ,CHINIQUE" },
    { value: 241, label: "QUICHÉ,ZACUALPA" },
    { value: 242, label: "QUICHÉ,CHAJUL" },
    { value: 243, label: "QUICHÉ,CHICHICASTENANGO" },
    { value: 244, label: "QUICHÉ,PATZITE" },
    {
        value: 245,
        label: "QUICHÉ,SAN ANTONIO ILOTENANGO",
    },
    {
        value: 246,
        label: "QUICHÉ,SAN PEDRO JOCOPILAS",
    },
    { value: 247, label: "QUICHÉ,CUNEN" },
    { value: 248, label: "QUICHÉ,SAN JUAN COTZAL" },
    { value: 249, label: "QUICHÉ,JOYABAJ" },
    { value: 250, label: "QUICHÉ,NEBAJ" },
    {
        value: 251,
        label: "QUICHÉ,SAN ANDRES SAJCABAJA",
    },
    { value: 252, label: "QUICHÉ,USPANTÁN" },
    { value: 253, label: "QUICHÉ,SACAPULAS" },
    {
        value: 254,
        label: "QUICHÉ,SAN BARTOLOMÉ JOCOTENANGO",
    },
    { value: 255, label: "QUICHÉ,CANILLA" },
    { value: 256, label: "QUICHÉ,CHICAMÁN" },
    { value: 257, label: "QUICHÉ,IXCÁN" },
    { value: 258, label: "QUICHÉ,PACHALÚM" },
    { value: 259, label: "QUICHÉ,GUMARCAJ" },
    { value: 260, label: "BAJA VERAPAZ,SALAMÁ" },
    {
        value: 261,
        label: "BAJA VERAPAZ,SAN MIGUEL CHICAJ",
    },
    { value: 262, label: "BAJA VERAPAZ,RABINAL" },
    { value: 263, label: "BAJA VERAPAZ,CUBULCO" },
    { value: 264, label: "BAJA VERAPAZ,GRANADOS" },
    {
        value: 265,
        label: "BAJA VERAPAZ,SANTA CRUZ EL CHOL",
    },
    {
        value: 266,
        label: "BAJA VERAPAZ,SAN JERÓNIMO",
    },
    { value: 267, label: "BAJA VERAPAZ,PURULHA" },
    { value: 268, label: "ALTA VERAPAZ,COBÁN" },
    {
        value: 269,
        label: "ALTA VERAPAZ,SANTA CRÚZ VERAPAZ",
    },
    {
        value: 270,
        label: "ALTA VERAPAZ,SAN CRISTÓBAL VERAPAZ",
    },
    { value: 271, label: "ALTA VERAPAZ,TACTIC" },
    { value: 272, label: "ALTA VERAPAZ,TAMAHÚ" },
    { value: 273, label: "ALTA VERAPAZ,TUCURÚ" },
    { value: 274, label: "ALTA VERAPAZ,PANZOS" },
    { value: 275, label: "ALTA VERAPAZ,SENAHÚ" },
    {
        value: 276,
        label: "ALTA VERAPAZ,SAN PEDRO CARCHA",
    },
    {
        value: 277,
        label: "ALTA VERAPAZ,SAN JUAN CHAMELCO",
    },
    { value: 278, label: "ALTA VERAPAZ,LANQUÍN" },
    { value: 279, label: "ALTA VERAPAZ,CAHABÓN" },
    { value: 280, label: "ALTA VERAPAZ,CHISEC" },
    { value: 281, label: "ALTA VERAPAZ,CHAHAL" },
    {
        value: 282,
        label: "ALTA VERAPAZ,FRAY BARTOLOMÉ DE LAS CASAS",
    },
    {
        value: 283,
        label: "ALTA VERAPAZ,SANTA CATARINA LA TINTA",
    },
    { value: 284, label: "ALTA VERAPAZ,CARCHA" },
    { value: 285, label: "ALTA VERAPAZ,RAXRUHÁ" },
    { value: 286, label: "PETÉN,FLORES" },
    { value: 287, label: "PETÉN,SAN JOSÉ" },
    { value: 288, label: "PETÉN,SAN BENITO" },
    { value: 289, label: "PETÉN,SAN ANDRÉS" },
    { value: 290, label: "PETÉN,LA LIBERTAD" },
    { value: 291, label: "PETÉN,SAN FRANCISCO" },
    { value: 292, label: "PETÉN,SANTA ANA" },
    { value: 293, label: "PETÉN,DOLORES" },
    { value: 294, label: "PETÉN,SAN LUIS" },
    { value: 295, label: "PETÉN,SAYAXCHÉ" },
    { value: 296, label: "PETÉN,MELCHOR DE MENCOS" },
    { value: 297, label: "PETÉN,POPTÚN" },
    { value: 298, label: "PETÉN,SAN JUAN DE DIOS" },
    { value: 299, label: "PETÉN,SANTA ELENA" },
    { value: 300, label: "PETÉN,LAS CRUCES" },
    { value: 301, label: "PETÉN,EL CHAL" },
    { value: 302, label: "IZABAL,PUERTO BARRIOS" },
    { value: 303, label: "IZABAL,LIVINGSTON" },
    { value: 304, label: "IZABAL,EL ESTOR" },
    { value: 305, label: "IZABAL,MORALES" },
    { value: 306, label: "IZABAL,LOS AMATES" },
    {
        value: 307,
        label: "IZABAL,SANTO TOMÁS DE CASTILLA",
    },
    { value: 308, label: "ZACAPA,ZACAPA" },
    { value: 309, label: "ZACAPA,ESTANZUELA" },
    { value: 310, label: "ZACAPA,RÍO HONDO" },
    { value: 311, label: "ZACAPA,GUALÁN" },
    { value: 312, label: "ZACAPA,TECULUTÁN" },
    { value: 313, label: "ZACAPA,USUMATLÁN" },
    { value: 314, label: "ZACAPA,CABAÑAS" },
    { value: 315, label: "ZACAPA,SAN DIEGO" },
    { value: 316, label: "ZACAPA,LA UNIÓN" },
    { value: 317, label: "ZACAPA,HUITE" },
    { value: 318, label: "CHIQUIMULA,CHIQUIMULA" },
    {
        value: 319,
        label: "CHIQUIMULA,SAN JOSÉ LA ARADA",
    },
    {
        value: 320,
        label: "CHIQUIMULA,SAN  JUAN  ERMITA",
    },
    { value: 321, label: "CHIQUIMULA,JOCOTÁN" },
    { value: 322, label: "CHIQUIMULA,CAMOTÁN" },
    { value: 323, label: "CHIQUIMULA,OLOPA" },
    { value: 324, label: "CHIQUIMULA,ESQUIPULAS" },
    {
        value: 325,
        label: "CHIQUIMULA,CONCEPCIÓN LAS MINAS",
    },
    { value: 326, label: "CHIQUIMULA,QUEZALTEPEQUE" },
    { value: 327, label: "CHIQUIMULA,SAN JACINTO" },
    { value: 328, label: "CHIQUIMULA,IPALA" },
    {
        value: 329,
        label: "CHIQUIMULA,ALDEA SANTA LUCIA",
    },
    { value: 330, label: "CHIQUIMULA,SANTA MARÍA" },
    { value: 331, label: "JALAPA,JALAPA" },
    { value: 332, label: "JALAPA,SAN PEDRO PINULA" },
    {
        value: 333,
        label: "JALAPA,SAN LUIS JILOTEPEQUE",
    },
    {
        value: 334,
        label: "JALAPA,SAN MANUEL CHAPARRON",
    },
    {
        value: 335,
        label: "JALAPA,SAN CARLOS ALZATATE",
    },
    { value: 336, label: "JALAPA,MONJAS" },
    { value: 337, label: "JALAPA,MATAQUESCUINTLA" },
    { value: 338, label: "JALAPA,ALDEA LA VENTURA" },
    { value: 339, label: "JALAPA,SAN PEDRO PINULA" },
    { value: 340, label: "JUTIAPA,JUTIAPA" },
    { value: 341, label: "JUTIAPA,EL  PROGRESO" },
    {
        value: 342,
        label: "JUTIAPA,SANTA CATARINA MITA",
    },
    { value: 343, label: "JUTIAPA,AGUA BLANCA" },
    { value: 344, label: "JUTIAPA,ASUNCIÓN MITA" },
    { value: 345, label: "JUTIAPA,YUPILTEPEQUE" },
    { value: 346, label: "JUTIAPA,ATESCATEMPA" },
    { value: 347, label: "JUTIAPA,JEREZ" },
    { value: 348, label: "JUTIAPA,EL ADELANTO" },
    { value: 349, label: "JUTIAPA,ZAPOTITLÁN" },
    { value: 350, label: "JUTIAPA,COMAPA" },
    { value: 351, label: "JUTIAPA,JALPATAGUA" },
    { value: 352, label: "JUTIAPA,CONGUACO" },
    { value: 353, label: "JUTIAPA,MOYUTA" },
    { value: 354, label: "JUTIAPA,PASACO" },
    {
        value: 355,
        label: "JUTIAPA,SAN JOSÉ ACATEMPA",
    },
    { value: 356, label: "JUTIAPA,QUESADA" },
    { value: 357, label: "JUTIAPA,CERRO GORDO" },
];
const getDepSelectOptions = () => {
    const optionsDep = exports.guatemalaCountryInfo?.map((x) => {
        const value = x.label.split(",")[0];
        return { label: value, value };
    }) ?? [];
    const uniqueValues = new Map();
    optionsDep.forEach((option) => {
        if (!uniqueValues.has(option.value)) {
            uniqueValues.set(option.value, option);
        }
    });
    const uniqueArray = Array.from(uniqueValues.values());
    return uniqueArray;
};
exports.getDepSelectOptions = getDepSelectOptions;
const getMunSelectOptions = () => {
    return (exports.guatemalaCountryInfo?.map((x) => {
        const value = x.label.split(",")[1];
        return { label: value, value };
    }) ?? []);
};
exports.getMunSelectOptions = getMunSelectOptions;
