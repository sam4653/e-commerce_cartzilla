const colorList = [
    // { no: 1, name: "Red", code: "#FF0000" },
    // { no: 2, name: "Blue", code: "#0000FF" },
    // { no: 3, name: "Green", code: "#006400" },
    // { no: 4, name: "Orange", code: "#FF6600" },
    // { no: 5, name: "White", code: "#FFFFFF" },
    // { no: 6, name: "Black", code: "#000000" },
    // { no: 7, name: "Yellow", code: "#FFFF00" },
    // { no: 8, name: "Purple", code: "#A020F0" },
    // { no: 9, name: "Silver", code: "#C0C0C0" },
    // { no: 10, name: "Brown", code: "#964B00" },
    // { no: 11, name: "Gray", code: "#808080" },
    // { no: 12, name: "Pink", code: "#FFC0CB" },
    // { no: 13, name: "Olive", code: "#808000" },
    // { no: 14, name: "Maroon", code: "#800000" },
    // { no: 15, name: "Violet", code: "#8F00FF" },
    // { no: 16, name: "Charcoal", code: "#36454F" },
    // { no: 17, name: "Magenta", code: "#FF00FF" },
    // { no: 18, name: "Bronze", code: "#CD7F32" },
    // { no: 19, name: "Cream", code: "#FFFDD0" },
    // { no: 20, name: "Gold", code: "#FFD700" },
    // { no: 21, name: "Tan", code: "#D2B48C" },
    // { no: 22, name: "Teal", code: "#008080" },
    // { no: 23, name: "Mustard", code: "#FFDB58" },
    // { no: 24, name: "Navy Blue", code: "#000080" },
    // { no: 25, name: "Coral", code: "#FF7F50" },
    // { no: 26, name: "Burgundy", code: "#800020" },
    // { no: 27, name: "Lavender", code: "#E6E6FA" },
    // { no: 28, name: "Mauve", code: "#E0b0FF" },
    // { no: 29, name: "Peach", code: "#FFE5B4" },
    // { no: 30, name: "Rust", code: "#B7410E" },
    // { no: 31, name: "Indigo", code: "#4B0082" },
    // { no: 32, name: "Ruby", code: "#E0115F" },
    // { no: 33, name: "Clay", code: "#CC7357" },
    // { no: 34, name: "Cyan", code: "#00FFFF" },
    // { no: 35, name: "Azure", code: "#007FFF" },
    // { no: 36, name: "Beige", code: "#F5F5DC" },
    // { no: 37, name: "Off White", code: "#FAF9F6" },
    // { no: 38, name: "Turquoise", code: "#30D5C8" },
    // { no: 39, name: "Amber", code: "#FFBF00" },
    // { no: 40, name: "Mint", code: "#3EB489" },
    { no: 1, name: "AliceBlue", code: "#F0F8FF" },
    { no: 2, name: "AntiqueWhite", code: "#FAEBD7" },
    { no: 3, name: "Aqua", code: "#00FFFF" },
    { no: 4, name: "Aquamarine", code: "#7FFFD4" },
    { no: 5, name: "Azure", code: "#F0FFFF" },
    { no: 6, name: "Beige", code: "#F5F5DC" },
    { no: 7, name: "Bisque", code: "#FFE4C4" },
    { no: 8, name: "Black", code: "#000000" },
    { no: 9, name: "BlanchedAlmond", code: "#FFEBCD" },
    { no: 10, name: "Blue", code: "#0000FF" },
    { no: 11, name: "BlueViolet", code: "#8A2BE2" },
    { no: 12, name: "Brown", code: "#A52A2A" },
    { no: 13, name: "BurlyWood", code: "#DEB887" },
    { no: 14, name: "CadetBlue", code: "#5F9EA0" },
    { no: 15, name: "Chartreuse", code: "#7FFF00" },
    { no: 16, name: "Chocolate", code: "#D2691E" },
    { no: 17, name: "Coral", code: "#FF7F50" },
    { no: 18, name: "CornflowerBlue", code: "#6495ED" },
    { no: 19, name: "Cornsilk", code: "#FFF8DC" },
    { no: 20, name: "Crimson", code: "#DC143C" },
    { no: 21, name: "Cyan", code: "#00FFFF" },
    { no: 22, name: "DarkBlue", code: "#00008B" },
    { no: 23, name: "DarkCyan", code: "#008B8B" },
    { no: 24, name: "DarkGoldenRod", code: "#B8860B" },
    { no: 25, name: "DarkGray", code: "#A9A9A9" },
    { no: 26, name: "DarkGreen", code: "#006400" },
    { no: 27, name: "DarkKhaki", code: "#BDB76B" },
    { no: 28, name: "DarkMagenta", code: "#8B008B" },
    { no: 29, name: "DarkOliveGreen", code: "#556B2F" },
    { no: 30, name: "DarkOrange", code: "#FF8C00" },
    { no: 31, name: "DarkOrchid", code: "#9932CC" },
    { no: 32, name: "DarkRed", code: "#8B0000" },
    { no: 33, name: "DarkSalmon", code: "#E9967A" },
    { no: 34, name: "DarkSeaGreen", code: "#8FBC8F" },
    { no: 35, name: "DarkSlateBlue", code: "#483D8B" },
    { no: 36, name: "DarkSlateGray", code: "#2F4F4F" },
    { no: 37, name: "DarkTurquoise", code: "#00CED1" },
    { no: 38, name: "DarkViolet", code: "#9400D3" },
    { no: 39, name: "DeepPink", code: "#FF1493" },
    { no: 40, name: "DeepSkyBlue", code: "#00BFFF" },
    { no: 41, name: "DimGray", code: "#696969" },
    { no: 42, name: "DodgerBlue", code: "#1E90FF" },
    { no: 43, name: "FireBrick", code: "#B22222" },
    { no: 44, name: "FloralWhite", code: "#FFFAF0" },
    { no: 45, name: "ForestGreen", code: "#228B22" },
    { no: 46, name: "Fuchsia", code: "#FF00FF" },
    { no: 47, name: "Gainsboro", code: "#DCDCDC" },
    { no: 48, name: "GhostWhite", code: "#F8F8FF" },
    { no: 49, name: "Gold", code: "#FFD700" },
    { no: 50, name: "GoldenRod", code: "#DAA520" },
    { no: 51, name: "Gray", code: "#808080" },
    { no: 52, name: "Green", code: "#008000" },
    { no: 53, name: "GreenYellow", code: "#ADFF2F" },
    { no: 54, name: "HoneyDew", code: "#F0FFF0" },
    { no: 55, name: "HotPink", code: "#FF69B4" },
    { no: 56, name: "IndianRed", code: "#CD5C5C" },
    { no: 57, name: "Indigo", code: "#4B0082" },
    { no: 58, name: "Ivory", code: "#FFFFF0" },
    { no: 59, name: "Khaki", code: "#F0E68C" },
    { no: 60, name: "Lavender", code: "#E6E6FA" },
    { no: 61, name: "LavenderBlush", code: "#FFF0F5" },
    { no: 62, name: "LawnGreen", code: "#7CFC00" },
    { no: 63, name: "LemonChiffon", code: "#FFFACD" },
    { no: 64, name: "LightBlue", code: "#ADD8E6" },
    { no: 65, name: "LightCoral", code: "#F08080" },
    { no: 66, name: "LightCyan", code: "#E0FFFF" },
    { no: 67, name: "LightGoldenRodYellow", code: "#FAFAD2" },
    { no: 68, name: "LightGray", code: "#D3D3D3" },
    { no: 69, name: "LightGreen", code: "#90EE90" },
    { no: 70, name: "LightPink", code: "#FFB6C1" },
    { no: 71, name: "LightSalmon", code: "#FFA07A" },
    { no: 72, name: "LightSeaGreen", code: "#20B2AA" },
    { no: 73, name: "LightSkyBlue", code: "#87CEFA" },
    { no: 74, name: "LightSlateGray", code: "#778899" },
    { no: 75, name: "LightSteelBlue", code: "#B0C4DE" },
    { no: 76, name: "LightYellow", code: "#FFFFE0" },
    { no: 77, name: "Lime", code: "#00FF00" },
    { no: 78, name: "LimeGreen", code: "#32CD32" },
    { no: 79, name: "Linen", code: "#FAF0E6" },
    { no: 80, name: "Magenta", code: "#FF00FF" },
    { no: 81, name: "Maroon", code: "#800000" },
    { no: 82, name: "MediumAquaMarine", code: "#66CDAA" },
    { no: 83, name: "MediumBlue", code: "#0000CD" },
    { no: 84, name: "MediumOrchid", code: "#BA55D3" },
    { no: 85, name: "MediumPurple", code: "#9370DB" },
    { no: 86, name: "MediumSeaGreen", code: "#3CB371" },
    { no: 87, name: "MediumSlateBlue", code: "#7B68EE" },
    { no: 88, name: "MediumSpringGreen", code: "#00FA9A" },
    { no: 89, name: "MediumTurquoise", code: "#48D1CC" },
    { no: 90, name: "MediumVioletRed", code: "#C71585" },
    { no: 91, name: "MidnightBlue", code: "#191970" },
    { no: 92, name: "MintCream", code: "#F5FFFA" },
    { no: 93, name: "MistyRose", code: "#FFE4E1" },
    { no: 94, name: "Moccasin", code: "#FFE4B5" },
    { no: 95, name: "NavajoWhite", code: "#FFDEAD" },
    { no: 96, name: "Navy", code: "#000080" },
    { no: 97, name: "OldLace", code: "#FDF5E6" },
    { no: 98, name: "Olive", code: "#808000" },
    { no: 99, name: "OliveDrab", code: "#6B8E23" },
    { no: 100, name: "Orange", code: "#FFA500" },
    { no: 101, name: "OrangeRed", code: "#FF4500" },
    { no: 102, name: "Orchid", code: "#DA70D6" },
    { no: 103, name: "PaleGoldenRod", code: "#EEE8AA" },
    { no: 104, name: "PaleGreen", code: "#98FB98" },
    { no: 105, name: "PaleTurquoise", code: "#AFEEEE" },
    { no: 106, name: "PaleVioletRed", code: "#DB7093" },
    { no: 107, name: "PapayaWhip", code: "#FFEFD5" },
    { no: 108, name: "PeachPuff", code: "#FFDAB9" },
    { no: 109, name: "Peru", code: "#CD853F" },
    { no: 110, name: "Pink", code: "#FFC0CB" },
    { no: 111, name: "Plum", code: "#DDA0DD" },
    { no: 112, name: "PowderBlue", code: "#B0E0E6" },
    { no: 113, name: "Purple", code: "#800080" },
    { no: 114, name: "RebeccaPurple", code: "#663399" },
    { no: 115, name: "Red", code: "#FF0000" },
    { no: 116, name: "RosyBrown", code: "#BC8F8F" },
    { no: 117, name: "RoyalBlue", code: "#4169E1" },
    { no: 118, name: "SaddleBrown", code: "#8B4513" },
    { no: 119, name: "Salmon", code: "#FA8072" },
    { no: 120, name: "SandyBrown", code: "#F4A460" },
    { no: 121, name: "SeaGreen", code: "#2E8B57" },
    { no: 122, name: "SeaShell", code: "#FFF5EE" },
    { no: 123, name: "Sienna", code: "#A0522D" },
    { no: 124, name: "Silver", code: "#C0C0C0" },
    { no: 125, name: "SkyBlue", code: "#87CEEB" },
    { no: 126, name: "SlateBlue", code: "#6A5ACD" },
    { no: 127, name: "SlateGray", code: "#708090" },
    { no: 128, name: "Snow", code: "#FFFAFA" },
    { no: 129, name: "SpringGreen", code: "#00FF7F" },
    { no: 130, name: "SteelBlue", code: "#4682B4" },
    { no: 131, name: "Tan", code: "#D2B48C" },
    { no: 132, name: "Teal", code: "#008080" },
    { no: 133, name: "Thistle", code: "#D8BFD8" },
    { no: 134, name: "Tomato", code: "#FF6347" },
    { no: 135, name: "Turquoise", code: "#40E0D0" },
    { no: 136, name: "Violet", code: "#EE82EE" },
    { no: 137, name: "Wheat", code: "#F5DEB3" },
    { no: 138, name: "White", code: "#FFFFFF" },
    { no: 139, name: "WhiteSmoke", code: "#F5F5F5" },
    { no: 140, name: "Yellow", code: "#FFFF00" },
    { no: 141, name: "YellowGreen", code: "#9ACD32" },
];
export default colorList;