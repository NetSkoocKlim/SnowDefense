export class AudioLoader {
    static items = {};


    static async loadAll(list = []) {
        const promises = [];

        list.forEach(({ key, src, loop = false, volume = 1 }) => {
            const audio = new Audio(src);
            audio.loop = loop;
            audio.volume = volume;
            AudioLoader.items[key] = audio;

            const p = new Promise(resolve => {
                audio.addEventListener(
                    "canplaythrough",
                    () => resolve(),
                    { once: true }
                );
            })

            promises.push(p);
        });

        await Promise.all(promises);
    }
}