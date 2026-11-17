const list = document.querySelector("#repository-list");
const status = document.querySelector("#status");

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium"
  }).format(date);
}

function renderRepository(repository) {
  const item = document.createElement("li");
  item.className = "repository";

  const link = document.createElement("a");
  link.href = repository.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = `${repository.owner}/${repository.name}`;

  const description = document.createElement("p");
  description.textContent = repository.description;

  const date = document.createElement("small");
  date.textContent = `Starred ${formatDate(repository.starredAt)}`;

  item.append(link, description, date);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a list.");
    }

    list.replaceChildren(...repositories.map(renderRepository));
    status.textContent = repositories.length
      ? ""
      : "No starred repositories yet now.";
  } catch (error) {
    console.error("Could not load starred repositories:", error);
    status.textContent = "Could not load repositories. Please try again later.";
  }
}

loadRepositories();
