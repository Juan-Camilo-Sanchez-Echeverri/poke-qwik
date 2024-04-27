import type { ResDetailPokemon } from '~/interfaces/res-detail-pokemon';

const baseUrl = 'https://pokeapi.co/api/v2/pokemon-species';

export const getDetailByPokemonId = async (id: string) => {
  const resp = await fetch(`${baseUrl}/${id}`);

  const data = (await resp.json()) as ResDetailPokemon;

  const descripInSpanish = data.flavor_text_entries.filter(
    (item) => item.language.name === 'es'
  );

  return descripInSpanish.map((item) => item.flavor_text).join(' ');
};
