// Nigerian States and Cities Data
export const nigerianStates = [
    {
        state: "Abia",
        cities: ["Aba", "Umuahia", "Ohafia", "Arochukwu", "Bende"]
    },
    {
        state: "Adamawa",
        cities: ["Yola", "Mubi", "Jimeta", "Numan", "Ganye"]
    },
    {
        state: "Akwa Ibom",
        cities: ["Uyo", "Eket", "Ikot Ekpene", "Oron", "Abak"]
    },
    {
        state: "Anambra",
        cities: ["Awka", "Onitsha", "Nnewi", "Ekwulobia", "Ihiala"]
    },
    {
        state: "Bauchi",
        cities: ["Bauchi", "Azare", "Misau", "Jama'are", "Katagum"]
    },
    {
        state: "Bayelsa",
        cities: ["Yenagoa", "Brass", "Sagbama", "Ogbia", "Nembe"]
    },
    {
        state: "Benue",
        cities: ["Makurdi", "Gboko", "Otukpo", "Katsina-Ala", "Vandeikya"]
    },
    {
        state: "Borno",
        cities: ["Maiduguri", "Bama", "Biu", "Dikwa", "Gubio"]
    },
    {
        state: "Cross River",
        cities: ["Calabar", "Ugep", "Ikom", "Obudu", "Ogoja"]
    },
    {
        state: "Delta",
        cities: ["Asaba", "Warri", "Sapele", "Ughelli", "Agbor"]
    },
    {
        state: "Ebonyi",
        cities: ["Abakaliki", "Afikpo", "Onueke", "Ezza", "Ishielu"]
    },
    {
        state: "Edo",
        cities: ["Benin City", "Auchi", "Ekpoma", "Uromi", "Ubiaja"]
    },
    {
        state: "Ekiti",
        cities: ["Ado-Ekiti", "Ikere", "Ijero", "Emure", "Ise"]
    },
    {
        state: "Enugu",
        cities: ["Enugu", "Nsukka", "Agbani", "Awgu", "Oji River"]
    },
    {
        state: "FCT",
        cities: ["Abuja", "Gwagwalada", "Kuje", "Bwari", "Kwali"]
    },
    {
        state: "Gombe",
        cities: ["Gombe", "Kumo", "Bajoga", "Deba", "Kaltungo"]
    },
    {
        state: "Imo",
        cities: ["Owerri", "Orlu", "Okigwe", "Mbaise", "Oguta"]
    },
    {
        state: "Jigawa",
        cities: ["Dutse", "Hadejia", "Gumel", "Kazaure", "Ringim"]
    },
    {
        state: "Kaduna",
        cities: ["Kaduna", "Zaria", "Kafanchan", "Kagoro", "Saminaka"]
    },
    {
        state: "Kano",
        cities: ["Kano", "Wudil", "Gwarzo", "Bichi", "Rano"]
    },
    {
        state: "Katsina",
        cities: ["Katsina", "Daura", "Funtua", "Malumfashi", "Dutsin-Ma"]
    },
    {
        state: "Kebbi",
        cities: ["Birnin Kebbi", "Argungu", "Yauri", "Zuru", "Jega"]
    },
    {
        state: "Kogi",
        cities: ["Lokoja", "Okene", "Idah", "Kabba", "Ankpa"]
    },
    {
        state: "Kwara",
        cities: ["Ilorin", "Offa", "Omu-Aran", "Jebba", "Lafiagi"]
    },
    {
        state: "Lagos",
        cities: [
            "Ikeja", "Lagos Island", "Victoria Island", "Lekki", "Ikorodu",
            "Epe", "Badagry", "Surulere", "Yaba", "Apapa",
            "Festac", "Ajah", "Oshodi", "Mushin", "Alimosho"
        ]
    },
    {
        state: "Nasarawa",
        cities: ["Lafia", "Keffi", "Akwanga", "Nasarawa", "Doma"]
    },
    {
        state: "Niger",
        cities: ["Minna", "Bida", "Kontagora", "Suleja", "Lapai"]
    },
    {
        state: "Ogun",
        cities: ["Abeokuta", "Ijebu Ode", "Sagamu", "Ota", "Ilaro"]
    },
    {
        state: "Ondo",
        cities: ["Akure", "Ondo", "Owo", "Ikare", "Ore"]
    },
    {
        state: "Osun",
        cities: ["Osogbo", "Ile-Ife", "Ilesa", "Ede", "Iwo"]
    },
    {
        state: "Oyo",
        cities: ["Ibadan", "Ogbomosho", "Oyo", "Iseyin", "Saki"]
    },
    {
        state: "Plateau",
        cities: ["Jos", "Bukuru", "Pankshin", "Shendam", "Langtang"]
    },
    {
        state: "Rivers",
        cities: ["Port Harcourt", "Obio-Akpor", "Eleme", "Okrika", "Bonny"]
    },
    {
        state: "Sokoto",
        cities: ["Sokoto", "Tambuwal", "Gwadabawa", "Bodinga", "Wurno"]
    },
    {
        state: "Taraba",
        cities: ["Jalingo", "Wukari", "Bali", "Gembu", "Ibi"]
    },
    {
        state: "Yobe",
        cities: ["Damaturu", "Potiskum", "Gashua", "Nguru", "Geidam"]
    },
    {
        state: "Zamfara",
        cities: ["Gusau", "Kaura Namoda", "Talata Mafara", "Bungudu", "Anka"]
    }
];

// Helper function to get cities by state
export const getCitiesByState = (stateName) => {
    const state = nigerianStates.find(s => s.state === stateName);
    return state ? state.cities : [];
};

// Get all state names
export const getAllStates = () => {
    return nigerianStates.map(s => s.state);
};
