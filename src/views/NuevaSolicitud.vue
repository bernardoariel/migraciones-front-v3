<template>
  <div class="flex flex-col lg:flex-row gap-6 bg-gray-100 min-h-screen p-4">
    <!-- Tabla de Personas -->
    <div class="flex-[2] bg-white p-4 rounded-lg shadow-md max-h-[85vh] overflow-y-hidden">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold mb-4">Lista de Personas</h2>
        <ul class="menu menu-horizontal menu-xs bg-base-200 rounded-box">
          <li>
            <a
              class="ml-1"
              :class="{ active: activeCategory === 'acompaneantes' }"
              @click="personStore.resetState('acompaneantes')"
            >
              Acompañantes
            </a>
          </li>
          <li>
            <a
              class="ml-1"
              :class="{ active: activeCategory === 'menores' }"
              @click="personStore.resetState('menores')"
            >
              Menores
            </a>
          </li>
          <li>
            <a
              class="ml-1"
              :class="{ active: activeCategory === 'autorizantes' }"
              @click="personStore.resetState('autorizantes')"
            >
              Autorizantes
            </a>
          </li>
        </ul>
        <button class="btn btn-circle" @click="personStore.setPersonId(null)">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
                stroke="#1C274C"
                stroke-width="1.5"
                stroke-linecap="round"
              ></path>
              <path
                d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
                stroke="#1C274C"
                stroke-width="1.5"
                stroke-linecap="round"
              ></path>
            </g>
          </svg>
        </button>
      </div>

      <!-- Tabla de Personas -->
      <PersonList />
    </div>

    <!-- Formulario dinámico -->
    <div
      class="flex-[2] bg-white p-4 rounded-lg shadow-md max-h-[85vh] overflow-auto flex justify-center"
    >
      <div v-if="!idPersonSelected && !activeCategory">
        <div
          class="!z-5 relative flex h-full w-full flex-col rounded-[20px] bg-white bg-clip-border p-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none"
        >
          <div class="mb-8 w-full">
            <h4 class="text-xl font-bold text-navy-700 dark:text-white">All projects</h4>
            <p class="mt-2 text-base text-gray-600">
              Here you can find more details about your projects. Keep you user engaged by providing
              meaningful information.
            </p>
          </div>
          <div
            class="flex w-full items-center justify-between rounded-2xl bg-white p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none"
          >
            <div class="flex items-center">
              <div class="">
                <svg
                  height="50"
                  width="50"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 58 58"
                  xml:space="preserve"
                  fill="#000000"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <g>
                      <path
                        style="fill: #fdc794"
                        d="M29.392,55c11.246,0.156,17.52-4.381,21.008-9.189c3.603-4.966,4.764-11.283,3.647-17.323 C50.004,6.642,29.392,6.827,29.392,6.827S8.781,6.642,4.738,28.488c-1.118,6.04,0.044,12.356,3.647,17.323 C11.872,50.618,18.146,55.156,29.392,55z"
                      ></path>
                      <path
                        style="fill: #f9a671"
                        d="M4.499,30.125c-0.453-0.429-0.985-0.687-1.559-0.687C1.316,29.438,0,31.419,0,33.862 c0,2.443,1.316,4.424,2.939,4.424c0.687,0,1.311-0.37,1.811-0.964C4.297,34.97,4.218,32.538,4.499,30.125z"
                      ></path>
                      <path
                        style="fill: #f9a671"
                        d="M57.823,26.298c-0.563-2.377-2.3-3.999-3.879-3.622c-0.491,0.117-0.898,0.43-1.225,0.855 c0.538,1.515,0.994,3.154,1.328,4.957c0.155,0.837,0.261,1.679,0.328,2.522c0.52,0.284,1.072,0.402,1.608,0.274 C57.562,30.908,58.386,28.675,57.823,26.298z"
                      ></path>
                      <path
                        style="fill: #5e5f62"
                        d="M13.9,16.999c-0.256,0-0.512-0.098-0.707-0.293l-5-5c-0.391-0.391-0.391-1.023,0-1.414 s1.023-0.391,1.414,0l5,5c0.391,0.391,0.391,1.023,0,1.414C14.412,16.901,14.156,16.999,13.9,16.999z"
                      ></path>
                      <path
                        style="fill: #5e5f62"
                        d="M16.901,13.999c-0.367,0-0.72-0.202-0.896-0.553l-3-6c-0.247-0.494-0.047-1.095,0.447-1.342 c0.495-0.245,1.095-0.046,1.342,0.447l3,6c0.247,0.494,0.047,1.095-0.447,1.342C17.204,13.964,17.051,13.999,16.901,13.999z"
                      ></path>
                      <path
                        style="fill: #5e5f62"
                        d="M20.9,11.999c-0.419,0-0.809-0.265-0.949-0.684l-2-6c-0.175-0.524,0.108-1.091,0.632-1.265 c0.525-0.176,1.09,0.108,1.265,0.632l2,6c0.175,0.524-0.108,1.091-0.632,1.265C21.112,11.982,21.005,11.999,20.9,11.999z"
                      ></path>
                      <path
                        style="fill: #5e5f62"
                        d="M25.899,10.999c-0.48,0-0.904-0.347-0.985-0.836l-1-6c-0.091-0.544,0.277-1.06,0.822-1.15 c0.549-0.099,1.06,0.277,1.151,0.822l1,6c0.091,0.544-0.277,1.06-0.822,1.15C26.009,10.995,25.954,10.999,25.899,10.999z"
                      ></path>
                      <path
                        style="fill: #5e5f62"
                        d="M29.9,10.999c-0.552,0-1-0.447-1-1v-6c0-0.553,0.448-1,1-1s1,0.447,1,1v6 C30.9,10.551,30.453,10.999,29.9,10.999z"
                      ></path>
                      <path
                        style="fill: #5e5f62"
                        d="M33.9,10.999c-0.104,0-0.211-0.017-0.316-0.052c-0.524-0.174-0.807-0.74-0.632-1.265l2-6 c0.174-0.523,0.739-0.809,1.265-0.632c0.524,0.174,0.807,0.74,0.632,1.265l-2,6C34.709,10.734,34.319,10.999,33.9,10.999z"
                      ></path>
                      <path
                        style="fill: #5e5f62"
                        d="M37.9,11.999c-0.104,0-0.211-0.017-0.316-0.052c-0.524-0.174-0.807-0.74-0.632-1.265l2-6 c0.175-0.523,0.738-0.808,1.265-0.632c0.524,0.174,0.807,0.74,0.632,1.265l-2,6C38.709,11.734,38.319,11.999,37.9,11.999z"
                      ></path>
                      <path
                        style="fill: #5e5f62"
                        d="M40.899,13.999c-0.15,0-0.303-0.034-0.446-0.105c-0.494-0.247-0.694-0.848-0.447-1.342l3-6 c0.247-0.493,0.846-0.692,1.342-0.447c0.494,0.247,0.694,0.848,0.447,1.342l-3,6C41.62,13.796,41.267,13.999,40.899,13.999z"
                      ></path>
                      <path
                        style="fill: #802d40"
                        d="M17.011,39.229v0.031c0,3.821,2.109,7.383,5.543,9.058c2.139,1.044,4.692,1.685,7.442,1.685 c2.747,0,5.304-0.64,7.449-1.682c3.45-1.676,5.566-5.257,5.555-9.093v0H17.011z"
                      ></path>
                      <path
                        style="fill: #f09372"
                        d="M17,34.003c-0.256,0-0.512-0.098-0.707-0.293c-0.391-0.391-0.391-1.023,0-1.414l6.293-6.293 l-6.293-6.293c-0.391-0.391-0.391-1.023,0-1.414s1.023-0.391,1.414,0l7,7c0.391,0.391,0.391,1.023,0,1.414l-7,7 C17.512,33.906,17.256,34.003,17,34.003z"
                      ></path>
                      <path
                        style="fill: #f09372"
                        d="M24,27.003h-7c-0.552,0-1-0.447-1-1s0.448-1,1-1h7c0.552,0,1,0.447,1,1S24.552,27.003,24,27.003z"
                      ></path>
                      <path
                        style="fill: #f09372"
                        d="M43,34.003c-0.256,0-0.512-0.098-0.707-0.293l-7-7c-0.391-0.391-0.391-1.023,0-1.414l7-7 c0.391-0.391,1.023-0.391,1.414,0s0.391,1.023,0,1.414l-6.293,6.293l6.293,6.293c0.391,0.391,0.391,1.023,0,1.414 C43.512,33.906,43.256,34.003,43,34.003z"
                      ></path>
                      <path
                        style="fill: #f09372"
                        d="M43,27.003h-7c-0.552,0-1-0.447-1-1s0.448-1,1-1h7c0.552,0,1,0.447,1,1S43.552,27.003,43,27.003z"
                      ></path>
                      <path
                        style="fill: #e64c3c"
                        d="M39.011,47.229c0-2.462-4.284-3.542-9.004-3.542s-8.996,1.079-8.996,3.542l0.015,0.134 c0.478,0.358,0.979,0.688,1.528,0.956c2.139,1.044,4.692,1.685,7.442,1.685c2.747,0,5.304-0.64,7.449-1.682 c0.574-0.279,1.096-0.627,1.593-1.004L39.011,47.229z"
                      ></path>
                    </g>
                  </g>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-base font-medium text-navy-700 dark:text-white">
                  Technology behind the Blockchain
                </p>
                <p class="mt-2 text-sm text-gray-600">
                  Project #1 .
                  <a
                    class="ml-1 font-medium text-brand-500 hover:text-brand-500 dark:text-white"
                    href=" "
                  >
                    See product details
                  </a>
                </p>
              </div>
            </div>
            <div class="mr-4 flex items-center justify-center text-gray-600 dark:text-white">
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 24 24"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 5.63l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83a.996.996 0 000-1.41z"
                ></path>
              </svg>
            </div>
          </div>
          <div
            class="mt-3 flex w-full items-center justify-between rounded-2xl bg-white p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none"
          >
            <div class="flex items-center">
              <div class="">
                <svg
                  height="50px"
                  width="50px"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 58 58"
                  xml:space="preserve"
                  fill="#000000"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <g>
                      <path
                        style="fill: #ffdb2b"
                        d="M7.75,20v30c0,2.2,1.8,4,4,4h34c2.2,0,4-1.8,4-4V20H7.75z"
                      ></path>
                      <g>
                        <g>
                          <path
                            style="fill: #d0e8f9"
                            d="M7.75,25.403c0,3.102,0.235,11.888,6,12.472c13.875,1.404,15-9.37,15-12.472 C22.244,21.922,14.256,21.922,7.75,25.403z"
                          ></path>
                          <path
                            style="fill: #35495e"
                            d="M16.138,39c-0.798,0-1.627-0.044-2.488-0.131c-3.147-0.318-6.899-2.913-6.899-13.467v-0.6 l0.528-0.282c6.768-3.621,15.176-3.621,21.943,0l0.528,0.282v0.6c0,2.002-0.406,7.027-4.17,10.429 C23.249,37.938,20.08,39,16.138,39z M8.755,26.009c0.071,4.87,1.05,10.461,5.096,10.87c4.525,0.458,8.023-0.394,10.389-2.531 c2.877-2.601,3.41-6.528,3.496-8.344C21.826,23.067,14.662,23.07,8.755,26.009z"
                          ></path>
                        </g>
                        <g>
                          <path
                            style="fill: #d0e8f9"
                            d="M28.75,25.403c0,3.102,1.125,13.876,15,12.472c5.765-0.584,6-9.37,6-12.472 C43.244,21.922,35.256,21.922,28.75,25.403z"
                          ></path>
                          <path
                            style="fill: #35495e"
                            d="M41.362,39c-3.942,0-7.111-1.063-9.442-3.169c-3.764-3.401-4.17-8.427-4.17-10.429v-0.6 l0.528-0.282c6.768-3.621,15.176-3.621,21.943,0l0.528,0.282v0.6c0,10.554-3.752,13.148-6.899,13.467 C42.99,38.956,42.16,39,41.362,39z M29.765,26.004c0.086,1.815,0.619,5.743,3.496,8.344c2.366,2.138,5.858,2.988,10.389,2.531 c4.046-0.409,5.024-6,5.096-10.87C42.838,23.068,35.674,23.066,29.765,26.004z"
                          ></path>
                        </g>
                      </g>
                      <path
                        style="fill: #7f8c8d"
                        d="M53.25,20H4.75c-1.925,0-3.5-1.575-3.5-3.5v0c0-1.925,1.575-3.5,3.5-3.5h48.5 c1.925,0,3.5,1.575,3.5,3.5v0C56.75,18.425,55.175,20,53.25,20z"
                      ></path>
                      <path
                        style="fill: #bdc3c7"
                        d="M48.25,13h-39l2.339-5.371c0.027-0.198,0.9-2.275,0.947-2.465c0.76-3.095,4.211-5.825,7.21-4.745 l7.532,2.712c1.171,0.422,2.451,0.439,3.633,0.048l6.617-2.887c2.156-0.712,4.615-0.114,5.995,1.688 c0.575,0.751,2.253,4.654,2.388,5.649L48.25,13z"
                      ></path>
                      <circle style="fill: #556080" cx="18.235" cy="31" r="2"></circle>
                      <circle style="fill: #556080" cx="39.235" cy="31" r="2"></circle>
                      <path
                        style="fill: #fec722"
                        d="M40.445,58H17.055c-0.721,0-1.305-0.584-1.305-1.305V54h26v2.695C41.75,57.416,41.166,58,40.445,58z "
                      ></path>
                      <path
                        style="fill: #556080"
                        d="M35.75,40h-14c-2.2,0-4,1.8-4,4v10h22V44C39.75,41.8,37.95,40,35.75,40z"
                      ></path>
                      <path
                        style="fill: #35495e"
                        d="M21.235,30c-0.256,0-0.512-0.098-0.707-0.293c-1.95-1.949-5.123-1.949-7.071,0 c-0.391,0.391-1.023,0.391-1.414,0s-0.391-1.023,0-1.414c2.728-2.728,7.17-2.729,9.899,0c0.391,0.391,0.391,1.023,0,1.414 C21.747,29.902,21.491,30,21.235,30z"
                      ></path>
                      <path
                        style="fill: #35495e"
                        d="M45.235,30c-0.256,0-0.512-0.098-0.707-0.293c-1.95-1.949-5.123-1.949-7.071,0 c-0.391,0.391-1.023,0.391-1.414,0s-0.391-1.023,0-1.414c2.729-2.728,7.171-2.729,9.899,0c0.391,0.391,0.391,1.023,0,1.414 C45.747,29.902,45.491,30,45.235,30z"
                      ></path>
                      <path
                        style="fill: #ffdb2b"
                        d="M29.75,49h2v2h0.927c1.697,0,3.073-1.376,3.073-3.073V47.5c0-2.485-2.015-4.5-4.5-4.5h-1.5h-2h-1.5 c-2.485,0-4.5,2.015-4.5,4.5v0.427c0,1.697,1.376,3.073,3.073,3.073h0.927v-2h2H29.75z"
                      ></path>
                      <path
                        style="fill: #e57e25"
                        d="M30.75,47h-4c-0.553,0-1-0.447-1-1s0.447-1,1-1h4c0.553,0,1,0.447,1,1S31.303,47,30.75,47z"
                      ></path>
                      <path
                        style="fill: #fec722"
                        d="M43.75,45v3c0,0.553,0.447,1,1,1s1-0.447,1-1v-3c0-2.206,1.794-4,4-4v-2 C46.441,39,43.75,41.691,43.75,45z"
                      ></path>
                      <path
                        style="fill: #fec722"
                        d="M11.75,45v3c0,0.553,0.447,1,1,1s1-0.447,1-1v-3c0-3.309-2.691-6-6-6v2 C9.956,41,11.75,42.794,11.75,45z"
                      ></path>
                    </g>
                  </g>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-base font-medium text-navy-700 dark:text-white">
                  Technology behind the Blockchain
                </p>
                <p class="mt-2 text-sm text-gray-600">
                  Project #1 .
                  <a
                    class="ml-1 font-medium text-brand-500 hover:text-brand-500 dark:text-white"
                    href=" "
                  >
                    See product details
                  </a>
                </p>
              </div>
            </div>
            <div class="mr-4 flex items-center justify-center text-gray-600 dark:text-white">
              <svg
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 57 57"
                xml:space="preserve"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <g>
                    <path
                      style="fill: #6e5847"
                      d="M28.5,0C14.475,0,3,11.475,3,25.5V50c0,2.2,1.8,4,4,4h6.777c4.16,2.021,9.237,3,14.723,3 s10.563-0.979,14.723-3H50c2.2,0,4-1.8,4-4V25.5C54,11.475,42.525,0,28.5,0z"
                    ></path>
                    <path
                      style="fill: #fdc794"
                      d="M3.869,29.894C3.305,32.001,3,34.215,3,36.5C3,50.583,14.417,57,28.5,57S54,50.583,54,36.5 C54,22.842,42.495,11.661,29,11h-1C14.505,11.661,3,22.842,3,36.5C3,50.583,14.417,57,28.5,57S54,50.583,54,36.5"
                    ></path>
                    <g>
                      <path
                        style="fill: #ffffff"
                        d="M18,40.676c0,6.075,4.925,11,11,11s11-4.925,11-11H18z"
                      ></path>
                      <path
                        style="fill: #ecf0f0"
                        d="M38,44.676h-4v-4c0-0.553-0.448-1-1-1s-1,0.447-1,1v4h-6v-4c0-0.553-0.448-1-1-1s-1,0.447-1,1v4h-4 c-0.552,0-1,0.447-1,1s0.448,1,1,1h4v4c0,0.553,0.448,1,1,1s1-0.447,1-1v-4h6v4c0,0.553,0.448,1,1,1s1-0.447,1-1v-4h4 c0.552,0,1-0.447,1-1S38.552,44.676,38,44.676z"
                      ></path>
                      <path
                        style="fill: #f9a671"
                        d="M29,52.676c-6.617,0-12-5.383-12-12c0-0.553,0.448-1,1-1h22c0.552,0,1,0.447,1,1 C41,47.293,35.617,52.676,29,52.676z M19.05,41.676c0.503,5.046,4.774,9,9.95,9s9.447-3.954,9.95-9H19.05z"
                      ></path>
                    </g>
                    <g>
                      <path
                        style="fill: #556080"
                        d="M26.854,25.533c0,3.217-1.117,10.195-14.895,8.739C6.233,33.667,6,28.751,6,25.533l0,0 C12.461,21.923,20.393,21.923,26.854,25.533L26.854,25.533z"
                      ></path>
                      <path
                        style="fill: #464f5d"
                        d="M15.446,35.468c-1.125,0-2.323-0.066-3.593-0.201C5,34.542,5,28.229,5,25.533v-0.587l0.512-0.286 c6.732-3.762,15.097-3.762,21.829,0l0.512,0.286v0.587c0,3.002-0.957,5.386-2.844,7.083 C22.902,34.514,19.693,35.468,15.446,35.468z M7.004,26.127c0.054,3.31,0.651,6.685,5.059,7.151 c5.477,0.579,9.382-0.146,11.609-2.148c1.328-1.194,2.055-2.877,2.167-5.008C19.976,23.075,12.866,23.076,7.004,26.127z"
                      ></path>
                    </g>
                    <g>
                      <path
                        style="fill: #556080"
                        d="M30.146,25.533c0,3.217,1.117,10.195,14.895,8.739C50.767,33.667,51,28.751,51,25.533l0,0 C44.539,21.923,36.607,21.923,30.146,25.533L30.146,25.533z"
                      ></path>
                      <path
                        style="fill: #464f5d"
                        d="M41.554,35.468c-4.248,0-7.456-0.954-9.563-2.852c-1.887-1.697-2.844-4.081-2.844-7.083v-0.587 l0.512-0.286c6.732-3.762,15.097-3.762,21.829,0L52,24.946v0.587c0,2.696,0,9.009-6.853,9.733 C43.877,35.401,42.679,35.468,41.554,35.468z M31.162,26.122c0.111,2.131,0.839,3.813,2.167,5.008 c2.228,2.004,6.132,2.728,11.609,2.148c4.407-0.467,5.005-3.842,5.059-7.151C44.134,23.075,37.024,23.074,31.162,26.122z"
                      ></path>
                    </g>
                    <g>
                      <line
                        style="fill: #556080"
                        x1="26.854"
                        y1="25.884"
                        x2="30.146"
                        y2="25.884"
                      ></line>
                      <rect
                        x="26.854"
                        y="24.884"
                        style="fill: #464f5d"
                        width="3.293"
                        height="2"
                      ></rect>
                    </g>
                    <path
                      style="fill: #8697cb"
                      d="M10.39,30.104c-0.26,0-0.519-0.101-0.715-0.301c-0.386-0.395-0.379-1.028,0.016-1.414l3.293-3.22 c0.395-0.387,1.027-0.379,1.414,0.016c0.386,0.395,0.379,1.028-0.016,1.414l-3.293,3.22C10.895,30.009,10.643,30.104,10.39,30.104z "
                    ></path>
                    <path
                      style="fill: #8697cb"
                      d="M14.78,32.25c-0.26,0-0.519-0.101-0.715-0.301c-0.386-0.395-0.379-1.028,0.016-1.414l5.488-5.366 c0.395-0.387,1.027-0.379,1.414,0.016c0.386,0.395,0.379,1.028-0.016,1.414l-5.488,5.366C15.285,32.155,15.033,32.25,14.78,32.25z"
                    ></path>
                    <path
                      style="fill: #8697cb"
                      d="M34.537,30.104c-0.26,0-0.519-0.101-0.715-0.301c-0.386-0.395-0.379-1.028,0.016-1.414l3.292-3.22 c0.395-0.387,1.027-0.379,1.414,0.016c0.386,0.395,0.379,1.028-0.016,1.414l-3.292,3.22C35.041,30.009,34.789,30.104,34.537,30.104 z"
                    ></path>
                    <path
                      style="fill: #8697cb"
                      d="M38.927,32.25c-0.26,0-0.519-0.101-0.715-0.301c-0.386-0.395-0.379-1.028,0.016-1.414l5.488-5.366 c0.395-0.387,1.027-0.379,1.414,0.016c0.386,0.395,0.379,1.028-0.016,1.414l-5.488,5.366C39.431,32.155,39.179,32.25,38.927,32.25z "
                    ></path>
                  </g>
                </g>
              </svg>
            </div>
          </div>
          <div
            class="mt-3 flex w-full items-center justify-between rounded-2xl bg-white p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none"
          >
            <div class="flex items-center">
              <div class="">
                <svg
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 57 57"
                  xml:space="preserve"
                  fill="#000000"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <g>
                      <path
                        style="fill: #6e5847"
                        d="M28.5,0C14.475,0,3,11.475,3,25.5V50c0,2.2,1.8,4,4,4h6.777c4.16,2.021,9.237,3,14.723,3 s10.563-0.979,14.723-3H50c2.2,0,4-1.8,4-4V25.5C54,11.475,42.525,0,28.5,0z"
                      ></path>
                      <path
                        style="fill: #fdc794"
                        d="M3.869,29.894C3.305,32.001,3,34.215,3,36.5C3,50.583,14.417,57,28.5,57S54,50.583,54,36.5 C54,22.842,42.495,11.661,29,11h-1C14.505,11.661,3,22.842,3,36.5C3,50.583,14.417,57,28.5,57S54,50.583,54,36.5"
                      ></path>
                      <g>
                        <path
                          style="fill: #ffffff"
                          d="M18,40.676c0,6.075,4.925,11,11,11s11-4.925,11-11H18z"
                        ></path>
                        <path
                          style="fill: #ecf0f0"
                          d="M38,44.676h-4v-4c0-0.553-0.448-1-1-1s-1,0.447-1,1v4h-6v-4c0-0.553-0.448-1-1-1s-1,0.447-1,1v4h-4 c-0.552,0-1,0.447-1,1s0.448,1,1,1h4v4c0,0.553,0.448,1,1,1s1-0.447,1-1v-4h6v4c0,0.553,0.448,1,1,1s1-0.447,1-1v-4h4 c0.552,0,1-0.447,1-1S38.552,44.676,38,44.676z"
                        ></path>
                        <path
                          style="fill: #f9a671"
                          d="M29,52.676c-6.617,0-12-5.383-12-12c0-0.553,0.448-1,1-1h22c0.552,0,1,0.447,1,1 C41,47.293,35.617,52.676,29,52.676z M19.05,41.676c0.503,5.046,4.774,9,9.95,9s9.447-3.954,9.95-9H19.05z"
                        ></path>
                      </g>
                      <g>
                        <path
                          style="fill: #556080"
                          d="M26.854,25.533c0,3.217-1.117,10.195-14.895,8.739C6.233,33.667,6,28.751,6,25.533l0,0 C12.461,21.923,20.393,21.923,26.854,25.533L26.854,25.533z"
                        ></path>
                        <path
                          style="fill: #464f5d"
                          d="M15.446,35.468c-1.125,0-2.323-0.066-3.593-0.201C5,34.542,5,28.229,5,25.533v-0.587l0.512-0.286 c6.732-3.762,15.097-3.762,21.829,0l0.512,0.286v0.587c0,3.002-0.957,5.386-2.844,7.083 C22.902,34.514,19.693,35.468,15.446,35.468z M7.004,26.127c0.054,3.31,0.651,6.685,5.059,7.151 c5.477,0.579,9.382-0.146,11.609-2.148c1.328-1.194,2.055-2.877,2.167-5.008C19.976,23.075,12.866,23.076,7.004,26.127z"
                        ></path>
                      </g>
                      <g>
                        <path
                          style="fill: #556080"
                          d="M30.146,25.533c0,3.217,1.117,10.195,14.895,8.739C50.767,33.667,51,28.751,51,25.533l0,0 C44.539,21.923,36.607,21.923,30.146,25.533L30.146,25.533z"
                        ></path>
                        <path
                          style="fill: #464f5d"
                          d="M41.554,35.468c-4.248,0-7.456-0.954-9.563-2.852c-1.887-1.697-2.844-4.081-2.844-7.083v-0.587 l0.512-0.286c6.732-3.762,15.097-3.762,21.829,0L52,24.946v0.587c0,2.696,0,9.009-6.853,9.733 C43.877,35.401,42.679,35.468,41.554,35.468z M31.162,26.122c0.111,2.131,0.839,3.813,2.167,5.008 c2.228,2.004,6.132,2.728,11.609,2.148c4.407-0.467,5.005-3.842,5.059-7.151C44.134,23.075,37.024,23.074,31.162,26.122z"
                        ></path>
                      </g>
                      <g>
                        <line
                          style="fill: #556080"
                          x1="26.854"
                          y1="25.884"
                          x2="30.146"
                          y2="25.884"
                        ></line>
                        <rect
                          x="26.854"
                          y="24.884"
                          style="fill: #464f5d"
                          width="3.293"
                          height="2"
                        ></rect>
                      </g>
                      <path
                        style="fill: #8697cb"
                        d="M10.39,30.104c-0.26,0-0.519-0.101-0.715-0.301c-0.386-0.395-0.379-1.028,0.016-1.414l3.293-3.22 c0.395-0.387,1.027-0.379,1.414,0.016c0.386,0.395,0.379,1.028-0.016,1.414l-3.293,3.22C10.895,30.009,10.643,30.104,10.39,30.104z "
                      ></path>
                      <path
                        style="fill: #8697cb"
                        d="M14.78,32.25c-0.26,0-0.519-0.101-0.715-0.301c-0.386-0.395-0.379-1.028,0.016-1.414l5.488-5.366 c0.395-0.387,1.027-0.379,1.414,0.016c0.386,0.395,0.379,1.028-0.016,1.414l-5.488,5.366C15.285,32.155,15.033,32.25,14.78,32.25z"
                      ></path>
                      <path
                        style="fill: #8697cb"
                        d="M34.537,30.104c-0.26,0-0.519-0.101-0.715-0.301c-0.386-0.395-0.379-1.028,0.016-1.414l3.292-3.22 c0.395-0.387,1.027-0.379,1.414,0.016c0.386,0.395,0.379,1.028-0.016,1.414l-3.292,3.22C35.041,30.009,34.789,30.104,34.537,30.104 z"
                      ></path>
                      <path
                        style="fill: #8697cb"
                        d="M38.927,32.25c-0.26,0-0.519-0.101-0.715-0.301c-0.386-0.395-0.379-1.028,0.016-1.414l5.488-5.366 c0.395-0.387,1.027-0.379,1.414,0.016c0.386,0.395,0.379,1.028-0.016,1.414l-5.488,5.366C39.431,32.155,39.179,32.25,38.927,32.25z "
                      ></path>
                    </g>
                  </g>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-base font-medium text-navy-700 dark:text-white">
                  Technology behind the Blockchain
                </p>
                <p class="mt-2 text-sm text-gray-600">
                  Project #1 .
                  <a
                    class="ml-1 font-medium text-brand-500 hover:text-brand-500 dark:text-white"
                    href=" "
                  >
                    See product details
                  </a>
                </p>
              </div>
            </div>
            <div class="mr-4 flex items-center justify-center text-gray-600 dark:text-white">
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 24 24"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 5.63l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83a.996.996 0 000-1.41z"
                ></path>
              </svg>
            </div>
          </div>
          <div
            class="mt-3 flex w-full items-center justify-between rounded-2xl bg-white p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none"
          >
            <div class="flex items-center">
              <div class="">
                <img
                  class="h-[83px] w-[83px] rounded-lg"
                  src="https://github.com/horizon-ui/horizon-tailwind-react-ts-corporate/blob/main/src/assets/img/profile/image3.png?raw=true"
                  alt=""
                />
              </div>
              <div class="ml-4">
                <p class="text-base font-medium text-navy-700 dark:text-white">
                  Technology behind the Blockchain
                </p>
                <p class="mt-2 text-sm text-gray-600">
                  Project #1 .
                  <a
                    class="ml-1 font-medium text-brand-500 hover:text-brand-500 dark:text-white"
                    href=" "
                  >
                    See product details
                  </a>
                </p>
              </div>
            </div>
            <div class="mr-4 flex items-center justify-center text-gray-600 dark:text-white">
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 24 24"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 5.63l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83a.996.996 0 000-1.41z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <component
        v-else
        :is="dynamicComponent"
        :personId="idPersonSelected"
        :buttons="buttonConfig"
        :ref="childRef"
      ></component>
    </div>

    <div class="flex-[1] max-h-[85vh] overflow-auto">
      <CardValidation />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import PersonList from '@/common/components/PersonList.vue';
import { usePersonStore } from '@/common/store/personStore';
import { computed, ref, watch } from 'vue';
import FormMenor from '@/modules/migraciones/menores/components/FormMenor.vue';
import FormAutorizante from '@/modules/migraciones/autorizantes/components/FormAutorizante.vue';
import FormAcompaneante from '@/modules/migraciones/acompaneantes/components/FormAcompaneante.vue';
import { useOrdenStore } from '@/common/store/ordenStore';
import CardValidation from '@/common/components/CardValidation.vue';

type ActiveCategory = 'menores' | 'autorizantes' | 'acompaneantes';
const childRef = ref();
// Interfaz para los botones
interface ButtonConfig {
  label: string;
  type?: 'button' | 'submit' | 'reset';
  class?: string;
  disabled?: boolean;
  position?: 'left' | 'right' | 'center';
  action: () => void;
}

const personStore = usePersonStore();
const { getActiveCategory, getIdPersonSelected } = storeToRefs(personStore);
const activeCategory = getActiveCategory;
const idPersonSelected = getIdPersonSelected;

const ordenStore = useOrdenStore();
const buttonConfig = ref<ButtonConfig[]>([]);
const updateButtonConfigurations = (): Record<string, ButtonConfig[]> => {
  return {
    menores: [
      {
        label: 'Cancelar',
        type: 'button',
        class: 'btn btn-ghost',
        action: () => personStore.resetState(),
        position: 'left',
      },
      {
        label: idPersonSelected.value ? 'Seleccionar Menor' : 'Agregar Menor',
        type: 'submit',
        class: idPersonSelected.value ? 'btn btn-secondary' : 'btn btn-primary',
        action: () => ordenStore.getPerson(activeCategory.value!, idPersonSelected.value),
        position: 'right',
      },
    ],
    autorizantes: [
      {
        label: 'Cancelar',
        type: 'button',
        class: 'btn btn-ghost',
        action: () => personStore.resetState(),
        position: 'left',
      },
      {
        label: idPersonSelected.value ? 'Seleccionar Autorizante' : 'Agregar Autorizante',
        type: 'submit',
        class: idPersonSelected.value ? 'btn btn-secondary' : 'btn btn-primary',
        action: () => ordenStore.getPerson(activeCategory.value!, idPersonSelected.value),
        position: 'right',
      },
    ],
    acompaneantes: [
      {
        label: 'Cancelar',
        type: 'button',
        class: 'btn btn-ghost',
        action: () => personStore.resetState(),
        position: 'left',
      },
      {
        label: idPersonSelected.value ? 'Seleccionar Acompañante' : 'Agregar Acompañante',
        type: 'submit',
        class: idPersonSelected.value ? 'btn btn-secondary' : 'btn btn-primary',
        action: () => ordenStore.getPerson(activeCategory.value!, idPersonSelected.value),
        position: 'right',
      },
    ],
  };
};

// Computed para el componente dinámico
const componentMap: Record<ActiveCategory, any> = {
  menores: FormMenor,
  autorizantes: FormAutorizante,
  acompaneantes: FormAcompaneante,
};
const dynamicComponent = computed(() => {
  const category = activeCategory.value as ActiveCategory;
  return componentMap[category] || null;
});

watch(
  [activeCategory, idPersonSelected],
  () => {
    const configs = updateButtonConfigurations();
    buttonConfig.value = configs[activeCategory.value || ''] || [];
  },
  { immediate: true },
);
</script>

<style scoped>
.min-h-screen {
  height: 100vh;
}
</style>
