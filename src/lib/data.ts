
export const defaults: any = {
  restaurantName: "Juniper & Ember",
  tagline: "A modern Indian kitchen",
  logoUrl: "",
  colors: {
    background: "#f7f3ea",
    text: "#20352b",
    primary: "#234c3a",
    accent: "#c66b4e",
    card: "#fffdf8",
  },
  fonts: {
    heading: "Georgia",
    body: "Arial",
  },
  hero: {
    eyebrow: "SEASONAL · LOCAL · MADE WITH CARE",
    title: "A little fire.\nA lot of soul.",
    description:
      "Thoughtful Indian cooking, seasonal ingredients, and a table that always has room for one more.",
    imageUrl:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1600&q=85",
    buttonText: "Explore our menu",
  },
  story: {
    title: "Rooted in tradition. Made for today.",
    body: "Familiar flavours in a new light, guided by the seasons and local produce.",
    journey:
      "Our journey began with a simple belief: the best meals make people feel at home.",
    imageUrl:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=85",
  },
  contact: {
    phone: "+91 00000 00000",
    email: "hello@example.com",
    address: "Add your restaurant address",
    openingHours: "Mon–Sun · 12 PM–10:30 PM",
    mapUrl: "",
  },
  sections: {
    hero: true,
    featuredMenu: true,
    story: true,
    gallery: true,
    visit: true,
  },
  gallery: [
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  ],
  menuIntro:
    "Seasonal plates, familiar favourites, and something new to discover.",
  footerText: "Made with care. Shared with joy.",
};

export async function content() {
  try {
    const { serverSupabase } = await import("@/lib/supabase-server");
    const supabase = await serverSupabase();

    const { data, error } = await supabase
      .from("published_site_content")
      .select("content")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error("Could not load published site content:", error.message);
      return defaults;
    }

    return { ...defaults, ...(data?.content ?? {}) };
  } catch (error) {
    console.error("Could not connect to Supabase site content:", error);
    return defaults;
  }
}

export async function dishes() {
  const demo = [
    {
      id: "d1",
      name: "Charred Paneer Tikka",
      description: "Smoky paneer, mint chutney, pickled onion.",
      price: "₹320",
      category: "Small plates",
      image_url:
        "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=80",
      is_available: true,
      sort_order: 1,
    },
    {
      id: "d2",
      name: "Seasonal Garden Bowl",
      description: "Fresh greens and roasted vegetables.",
      price: "₹280",
      category: "From the kitchen",
      image_url: "",
      is_available: true,
      sort_order: 2,
    },
    {
      id: "d3",
      name: "Slow-Cooked Dal",
      description: "Black lentils, warming spices, smoked butter.",
      price: "₹260",
      category: "From the kitchen",
      image_url: "",
      is_available: true,
      sort_order: 3,
    },
    {
      id: "d4",
      name: "Cardamom Panna Cotta",
      description: "Silky cream, seasonal fruit.",
      price: "₹190",
      category: "Something sweet",
      image_url: "",
      is_available: true,
      sort_order: 4,
    },
  ];

  try {
    const { serverSupabase } = await import("@/lib/supabase-server");
    const supabase = await serverSupabase();

    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("is_available", true)
      .order("sort_order");

    if (error) {
      console.error("Could not load menu items:", error.message);
      return demo;
    }

    if (data?.length) {
      return data;
    }
  } catch (error) {
    console.error("Could not connect to Supabase menu:", error);
  }

  return demo;
}
