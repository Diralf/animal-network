import { main } from './use-cases/animal-train-grass-one-by-one-by-fit/main';

if (process.argv[2] === 'run') {
    main();
}

export { main };
