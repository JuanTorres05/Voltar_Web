import { Artist, ArtistArtwork, ArtistSubmission, SubmissionStatus } from '@/shared/types';
import { MOCK_ARTISTS, MOCK_ARTWORKS } from '@/shared/data/artists.mock';

const STORAGE_KEY = 'voltar-artist-submissions';

export function getSubmissions(): ArtistSubmission[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ArtistSubmission[]) : [];
  } catch {
    return [];
  }
}

export function saveSubmissions(list: ArtistSubmission[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function createSubmission(
  input: Omit<ArtistSubmission, 'id' | 'status' | 'created_at' | 'royalty_usd'>
): ArtistSubmission {
  const newItem: ArtistSubmission = {
    ...input,
    id: `sub-${Date.now()}`,
    royalty_usd: 5,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  const current = getSubmissions();
  saveSubmissions([newItem, ...current]);
  return newItem;
}

export function updateSubmissionStatus(id: string, status: SubmissionStatus): ArtistSubmission[] {
  const updated = getSubmissions().map((item) =>
    item.id === id ? { ...item, status } : item
  );
  saveSubmissions(updated);
  return updated;
}

export function deleteSubmission(id: string): ArtistSubmission[] {
  const updated = getSubmissions().filter((item) => item.id !== id);
  saveSubmissions(updated);
  return updated;
}

/** Devuelve todos los artistas (oficiales + aprobados) y todas las obras aprobadas */
export function getMergedGalleryData(): {
  artists: Artist[];
  artworks: ArtistArtwork[];
} {
  const approved = getSubmissions().filter((s) => s.status === 'approved');
  if (approved.length === 0) {
    return { artists: MOCK_ARTISTS, artworks: MOCK_ARTWORKS };
  }

  const artistsMap = new Map<string, Artist>();
  MOCK_ARTISTS.forEach((a) => artistsMap.set(a.tag.toUpperCase(), a));

  const extraArtworks: ArtistArtwork[] = approved.map((sub) => {
    const tagKey = sub.artist_tag.trim().toUpperCase();
    let artist = artistsMap.get(tagKey);

    if (!artist) {
      artist = {
        id: `art-${sub.id}`,
        slug: sub.artist_tag.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        tag: tagKey,
        crew: sub.artist_crew.toUpperCase() || 'INDEPENDIENTE',
        city: sub.artist_city || 'LATAM',
        style: sub.style,
        bio: sub.artist_bio || 'Artista emergente de la galería VØLTAR®.',
        instagram: sub.artist_instagram || '@voltar.crew',
        accentColor: 'volt',
      };
      artistsMap.set(tagKey, artist);
    }

    return {
      id: sub.id,
      artist_id: artist.id,
      artist_tag: artist.tag,
      artist_crew: artist.crew,
      title: sub.title.toUpperCase(),
      style: sub.style,
      image_url: sub.image_url,
      description: sub.description,
      royalty_usd: sub.royalty_usd,
    };
  });

  return {
    artists: Array.from(artistsMap.values()),
    artworks: [...extraArtworks, ...MOCK_ARTWORKS],
  };
}
