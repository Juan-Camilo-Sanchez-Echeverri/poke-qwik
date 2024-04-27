import {
  component$,
  useContext,
  useOnDocument,
  useTask$,
} from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

import { PokemonImage } from '~/components/pokemons/PokemonImage';
import { getSmallPokemons } from '~/helpers/get-small-pokemons';

import { $ } from '@builder.io/qwik';
import { PokemonListContext } from '~/context';

/* interface PokemonPageState {
  currentPage: number;
  isLoading: boolean;
  pokemons: SmallPokemon[];
} */

export default component$(() => {
  /* const pokemonState = useStore<PokemonPageState>({
    currentPage: 0,
    isLoading: false,
    pokemons: [],
  }); */

  const pokemonState = useContext(PokemonListContext);

  //Solo el cliente
  /*  useVisibleTask$(async ({ track }) => {
    track(() => pokemonState.currentPage);
    const pokemons = await getSmallPokemons(pokemonState.currentPage * 10);
    pokemonState.pokemons = [...pokemonState.pokemons, ...pokemons];
  }); */

  useTask$(async ({ track }) => {
    track(() => pokemonState.currentPage);

    const pokemons = await getSmallPokemons(pokemonState.currentPage * 10, 30);
    pokemonState.pokemons = [...pokemonState.pokemons, ...pokemons];

    pokemonState.isLoading = false;
  });

  useOnDocument(
    'scroll',
    $(() => {
      const maxScroll = document.body.scrollHeight;
      const currentScroll = window.scrollY + window.innerHeight;

      if (currentScroll + 200 >= maxScroll && !pokemonState.isLoading) {
        pokemonState.isLoading = true;
        pokemonState.currentPage++;
      }
    })
  );

  return (
    <>
      <div class="flex flex-col">
        <span class="my-5 text-5xl">Status</span>
        <span>Página Actual: {pokemonState.currentPage}</span>
        <span>Está cargando: </span>
      </div>

      <div class="mt-10">
        {/* <button
          class="btn btn-primary mr-2"
          onClick$={() => pokemonState.currentPage--}
        >
          Anteriores
        </button> */}
        <button
          class="btn btn-primary mr-2"
          onClick$={() => pokemonState.currentPage++}
        >
          Siguientes
        </button>
      </div>

      <div class="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 mt-5">
        {pokemonState.pokemons.map((pokemon, index) => (
          <div
            key={index}
            class="m-5 flex flex-col justify-center items-center"
          >
            <PokemonImage id={pokemon.id} />
            <span class="capitalize">{pokemon.name}</span>
          </div>
        ))}
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'List Client',
};
