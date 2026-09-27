const SUPABASE_URL =
    "https://fsbjmbsaelziokfxuceu.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_2R1qWvsM0ZV58svpkX1O-g_vDFBu9oq";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );



async function adminLogin(event) {

    event.preventDefault();


    const email =
        document.getElementById("admin-email").value.trim();

    const password =
        document.getElementById("admin-password").value;


    // Login with Supabase

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({

            email: email,

            password: password

        });


    if (error) {

        alert(
            "Login failed: " +
            error.message
        );

        return;
    }


    const user = data.user;


    // Get user's role

    const {
        data: profile,
        error: profileError
    } = await supabaseClient

        .from("profiles")

        .select("role")

        .eq("id", user.id)

        .single();


    if (profileError || !profile) {

        alert("Admin profile not found.");

        await supabaseClient.auth.signOut();

        return;
    }


    // Check admin role

    if (profile.role !== "admin") {

        alert(
            "This account is not an Admin account."
        );

        await supabaseClient.auth.signOut();

        return;
    }


    // Admin login successful

    window.location.href = "index.html";

}