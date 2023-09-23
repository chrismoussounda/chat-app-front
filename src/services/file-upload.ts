import supabase from './supabase';

export async function uploadFile(file: File) {
  const fileName = `${Math.random()}-${file.name}`;
  const { error: storageError } = await supabase.storage.from('files').upload(fileName, file);
  if (storageError) throw new Error(storageError.message);
  return supabase.storage.from('files').getPublicUrl(fileName).data.publicUrl;
}

export async function deleteFile(url: string) {
  const { error: storageError, data } = await supabase.storage
    .from('files')
    .remove([url.split('files/').reverse()[0]]);
  if (storageError) throw new Error(storageError.message);
  console.log(data);
}
