import {
  component$,
  useComputed$,
  useSignal,
  $,
  useStore,
  useVisibleTask$,
} from '@builder.io/qwik';
import {
  Link,
  routeLoader$,
  useLocation,
  type DocumentHead,
} from '@builder.io/qwik-city';
import { getSmallPokemons, getDetailByPokemonId } from '~/helpers/';
import { PokemonImage } from '../../../components/pokemons/PokemonImage';
import type { SmallPokemon } from '~/interfaces';
import { Modal } from '~/components/shared';

export const usePokemonList = routeLoader$<SmallPokemon[]>(
  async ({ query, redirect, url, pathname }) => {
    const offset = Number(query.get('offset') || 0);
    if (offset < 0) throw redirect(308, new URL(pathname, url).toString());
    if (isNaN(offset)) throw redirect(308, new URL(pathname, url).toString());

    return await getSmallPokemons(offset, 10);

    /* const resp = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`
    );
    const data = (await resp.json()) as PokemonListResponse;

    return data.results; */
  }
);

export default component$(() => {
  const pokemons = usePokemonList();
  const location = useLocation();

  const modalVisible = useSignal(false);
  const modalPokemon = useStore({
    id: '',
    name: '',
  });

  const chatGptPokemonFact = useSignal('');

  //Modal functions
  const showModal = $((id: string, name: string) => {
    modalPokemon.id = id;
    modalPokemon.name = name;
    modalVisible.value = true;
  });

  const closeModal = $(() => {
    modalVisible.value = false;
  });

  useVisibleTask$(({ track }) => {
    track(() => modalPokemon.name);

    if (modalPokemon.name.length > 0) {
      chatGptPokemonFact.value = '';
      getDetailByPokemonId(modalPokemon.id).then(
        (resp) => (chatGptPokemonFact.value = resp)
      );
    }
  });

  const currentOffset = useComputed$<number>(() => {
    const offsetString = new URLSearchParams(location.url.search);
    return Number(offsetString.get('offset') || 0);
  });

  return (
    <>
      <div class="flex flex-col">
        <span class="my-5 text-5xl">Status</span>
        <span>Offset: {currentOffset}</span>
        <span>Está cargando página: {location.isNavigating ? 'si' : 'no'}</span>
      </div>

      <div class="mt-10">
        <Link
          href={`/pokemons/list-ssr/?offset=${currentOffset.value - 10}`}
          class="btn btn-primary mr-2"
        >
          Anteriores
        </Link>
        <Link
          href={`/pokemons/list-ssr/?offset=${currentOffset.value + 10}`}
          class="btn btn-primary"
        >
          Siguientes
        </Link>
      </div>

      <div class="grid grid-cols-6 mt-5">
        {pokemons.value.map((pokemon) => (
          <div
            key={pokemon.name}
            onClick$={() => showModal(pokemon.id, pokemon.name)}
            class="m-5 flex flex-col justify-center items-center"
          >
            <PokemonImage id={pokemon.id} />
            <span class="capitalize">{pokemon.name}</span>
          </div>
        ))}
      </div>

      <Modal showModal={modalVisible.value} closeFn={closeModal} persistent>
        <div q:slot="title">{modalPokemon.name}</div>
        <div q:slot="content" class="flex flex-col justify-center items-center">
          <PokemonImage id={modalPokemon.id} />
          <span>
            {chatGptPokemonFact.value == ''
              ? 'Cargando...'
              : chatGptPokemonFact}
          </span>
        </div>
      </Modal>
    </>
  );
});

export const head: DocumentHead = {
  title: 'List SSR',
};
