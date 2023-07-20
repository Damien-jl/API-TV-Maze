
"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm"); 


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // this function gets the api with the inputed term and filters through it to find a show that matches the term. It then returns the information of that show.
  const searchShow = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);
  const res = searchShow.data.map((result) => {
      const showInfo = result.show;

  return {
    
      id: showInfo.id,
      name: showInfo.name,
      summary: showInfo.summary,
      image: showInfo.image ? showInfo.image.medium : 'https://tinyurl.com/tv-missing'
  };
});
  return res;
} 


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  // we are making sure there is no shows shown before we start typing. We then loop over the shows that are close to what we inputed then appending them to the showList.
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}" alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);
    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/* Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

 async function getEpisodesOfShow(id) {
    const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
    const episodes = res.data.map((episode) => {
      return {
        id: episode.id,
        name: episode.name,
        season: episode.season,
        number: episode.number
      }
    })
    return episodes;
  } 

/** Write a clear docstring for this function... */

 function populateEpisodes(episodes) {
  // first we're emptying the episodeList ul then loops through all of the episodes from the getEpisodeOfShows function and makes a new li for each episode which contains the episode's name, season, and what number episode. Then appends them to the episodesList.
    const $episodeList = $('#episodesList');
    $episodeList.empty();

    for (let episode of episodes) {
    const $li = $(`<li> ${episode.name} (season ${episode.season}, episode ${episode.number}) </li>`);
    $episodeList.append($li);
    }
  }

  /* this click event is looking for any element with the class of Show-getEpisodes which is generated for each show. 
  When the episodes button is clicked the event handler looks for a parent element with class of .Show, this then finds the show ID in the data-show-id attribute. 
  Next the getEpisodeOfShow function is called to get the episodes of that show. Lastly, the populateEpisodes function is called to display the episodes in the episodeList.*/
  $showsList.on('click', '.Show-getEpisodes', async function () {
    const $show = $(this).closest(".Show");
    const showId = $show.data("show-id");
    const episodes = await getEpisodesOfShow(showId);
  
    $episodesArea.show();
    populateEpisodes(episodes);
  })

/*
"use strict";

const MISSING_IMAGE_URL = "https://tinyurl.com/missing-tv";
const TVMAZE_API_URL = "http://api.tvmaze.com/";

const $showsList = $("#showsList");
const $episodesList = $("#episodesList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */
/*
async function getShowsByTerm(term) {
  const response = await axios({
    baseURL: TVMAZE_API_URL,
    url: "search/shows",
    method: "GET",
    params: {
      q: term,
    },
  });

  return response.data.map(result => {
    const show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : MISSING_IMAGE_URL,
    };
  });
}


/** Given list of shows, create markup for each and to DOM */
/*
function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
           <div class="media">
             <img src="${show.image}" alt="${show.name}" class="w-25 me-3">
             <div class="media-body">
               <h5 class="text-primary">${show.name}</h5>
               <div><small>${show.summary}</small></div>
               <button class="btn btn-outline-light btn-sm Show-getEpisodes">
                 Episodes
               </button>
             </div>
           </div>
        </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */
/*
async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
/*
async function getEpisodesOfShow(id) {
  const response = await axios({
    baseURL: TVMAZE_API_URL,
    url: `shows/${id}/episodes`,
    method: "GET",
  });

  return response.data.map(e => ({
    id: e.id,
    name: e.name,
    season: e.season,
    number: e.number,
  }));
}


/** Given list of episodes, create markup for each and to DOM */
/*
function populateEpisodes(episodes) {
  $episodesList.empty();

  for (let episode of episodes) {
    const $item = $(
      `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `);

    $episodesList.append($item);
  }

  $episodesArea.show();
}


/** Handle click on episodes button: get episodes for show and display */
/*
async function getEpisodesAndDisplay(evt) {
  // here's one way to get the ID of the show: search "closest" ancestor
  // with the class of .Show (which is put onto the enclosing div, which
  // has the .data-show-id attribute).
  const showId = $(evt.target).closest(".Show").data("show-id");

  // here's another way to get the ID of the show: search "closest" ancestor
  // that has an attribute of 'data-show-id'. This is called an "attribute
  // selector", and it's part of CSS selectors worth learning.
  // const showId = $(evt.target).closest("[data-show-id]").data("show-id");

  const episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
}

$showsList.on("click", ".Show-getEpisodes", getEpisodesAndDisplay);
*/