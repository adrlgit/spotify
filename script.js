document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const resultArtist = document.getElementById("result-artist");
    const resultPlaylist = document.getElementById('result-playlists');
    let debounceTimeout;

    function requestApi(searchTerm) {
        const url = `http://localhost:3000/artists?name_like=${searchTerm}`;
        console.log(`Fetching from: ${url}`);

        fetch(url)
            .then((response) => response.json())
            .then((result) => {
                console.log('Resultados da API:', result);
                
                // Verifica se há um único resultado com nome exato
                const exactMatch = result.find(artist => artist.name.toLowerCase() === searchTerm);
                
                if (exactMatch) {
                    displayResults([exactMatch]); // Mostra apenas o artista exato
                } else {
                    displayResults(result); // Mostra todos os resultados parciais
                }
            })
            .catch((error) => console.error('Erro ao buscar dados:', error));
    }

    function displayResults(result) {
        resultPlaylist.classList.add("hidden");
        resultArtist.innerHTML = '';

        if (result.length === 0) {
            console.log('Nenhum resultado encontrado');
            resultArtist.innerHTML = '<p>Nenhum artista encontrado.</p>';
        } else {
            result.forEach(element => {
                const artistDiv = document.createElement('div');
                artistDiv.classList.add('artist');

                const artistName = document.createElement('h2');
                artistName.innerText = element.name;

                const artistImage = document.createElement('img');
                artistImage.src = element.urlImg;
                artistImage.alt = `Imagem de ${element.name}`;

                artistDiv.appendChild(artistName);
                artistDiv.appendChild(artistImage);

                resultArtist.appendChild(artistDiv);
            });
        }
        resultArtist.classList.remove('hidden');
    }

    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.trim().toLowerCase();
        console.log(`Termo de busca: ${searchTerm}`);

        clearTimeout(debounceTimeout);

        if (searchTerm === '') {
            resultPlaylist.classList.remove('hidden');
            resultArtist.classList.add('hidden');
            return;
        }

        debounceTimeout = setTimeout(() => {
            requestApi(searchTerm);
        }, 500); // Aguarda 500ms antes de fazer a requisição
    });
});
