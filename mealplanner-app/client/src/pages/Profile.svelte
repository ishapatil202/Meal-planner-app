<script>
  import axios from "axios";
  import { onMount } from "svelte";
  import MealCard from "../components/MealCard.svelte";

  export let id; 

  let profile = null; 
  let errorMessage = ""; 
  let loading = true; 

  onMount(async () => {
    try {
   
      if (!id) throw new Error("User ID is missing. Cannot fetch profile.");

      
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.header_token) {
        throw new Error("Missing authentication token. Please log in again.");
      }

      
      const response = await axios.get(`http://localhost:8080/users/${id}`, {
        headers: { Authorization: user.header_token },
      });

    
      profile = response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      errorMessage = error.message || "Failed to load user profile.";
    } finally {
      loading = false;
    }
  });
</script>

<div class="profile-container">
  {#if loading}
    <div>Loading User Profile...</div>
  {:else if errorMessage}
    <div class="error-message">{errorMessage}</div>
  {:else if profile}
    <h1>Welcome, {profile.username}!</h1>
    <p>Preferences: {profile.preferences ? profile.preferences.join(", ") : "None"}</p>
    <hr />
    <h2>Meal Planner</h2>
    <div class="meal-list">
      {#if profile.mealplans.length === 0}
        <p>No Meals in your meal plans</p>
      {:else}
        {#each profile.mealplans as mealplan}
          <div class="mealplan">
            <h2 class="meal-week">Week: {mealplan.week}</h2>
            <div class="meal-cards">
              {#each mealplan.meals as meal}
                <MealCard
                  image={meal.image}
                  name={meal.name}
                  diets={meal.diets}
                />
              {/each}
            </div>
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style>
  .profile-container {
    margin: 2rem auto;
    padding: 2rem;
    text-align: left;
    max-width: 800px;
  }

  h1 {
    font-family: 'Montserrat', sans-serif;
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1rem;
    color: #555;
  }

  h2 {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.5rem;
    margin-top: 1.5rem;
  }

  .meal-list {
    margin-top: 2rem;
  }

  .mealplan {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 8px;
    background-color: #f9f9f9;
    margin-bottom: 1rem;
  }

  .meal-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
  }

  .error-message {
    color: red;
    font-weight: bold;
    margin: 1rem 0;
  }
</style>
