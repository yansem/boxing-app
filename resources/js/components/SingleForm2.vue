<template>
    <div class="grid justify-items-center">
        <form class="w-full max-w-lg border-2 border-yellow-300 rounded-2xl p-2">
            <div class="flex flex-wrap -mx-3">
                <div class="flex w-full px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                           for="grid-first-name">
                        Количество раундов
                    </label>
                    <div>
                        <input
                            class="appearance-none block w-[60px] bg-gray-200 text-gray-700 border rounded pl-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="grid-first-name" type="number">
                    </div>
                </div>
                <div class="flex w-full px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                           for="grid-first-name">
                        Время раунда
                    </label>
                    <div>
                        <input
                            class="appearance-none block w-[60px] bg-gray-200 text-gray-700 border rounded pl-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="grid-first-name" type="number">
                    </div>
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                           for="grid-password">
                        Удары
                    </label>
                    <div class="flex justify-center">
                        <div class="border border-black rounded w-[130px]">
                            <div class="flex justify-center">
                                <div>
                                    <label for="1">1</label>
                                    <input type="checkbox" id="1">
                                </div>
                                <div>
                                    <label for="2">2</label>
                                    <input type="checkbox" id="2">
                                </div>
                            </div>
                            <div class="flex justify-center">
                                <div>
                                    <label for="1">1</label>
                                    <input type="checkbox" id="1">
                                </div>
                                <div>
                                    <label for="2">2</label>
                                    <input type="checkbox" id="2">
                                </div>
                            </div>
                            <div class="flex justify-center">
                                <div>
                                    <label for="1">1</label>
                                    <input type="checkbox" id="1">
                                </div>
                                <div>
                                    <label for="2">2</label>
                                    <input type="checkbox" id="2">
                                </div>
                            </div>
                            <div class="flex justify-center">
                                <div>
                                    <label for="1">1</label>
                                    <input type="checkbox" id="1">
                                </div>
                                <div>
                                    <label for="2">2</label>
                                    <input type="checkbox" id="2">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: 'SingleForm'
}
</script>
