<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Classes') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <button id="addClassButton" class="mb-4 px-4 py-2 bg-blue-500 text-white rounded">Add Class</button>
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                            <tr>
                                <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Class Name
                                </th>
                                <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Token
                                </th>
                                <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            @forelse ($data as $class)
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {{ $class->class_name }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {{ $class->token }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                        <button class="text-blue-600 hover:text-blue-900 editClassButton" data-id="{{ $class->id }}" data-name="{{ $class->class_name }}" data-token="{{ $class->token }}">Edit</button>
                                        <form action="{{ route('classes.destroy', $class->id) }}" method="POST" class="inline-block">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="text-red-600 hover:text-red-900 ml-2">Delete</button>
                                        </form>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="3" class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 text-center">
                                        No Data Found
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Class Modal -->
    <div id="addClassModal" class="fixed z-10 inset-0 overflow-y-auto hidden">
        <div class="flex items-center justify-center min-h-screen">
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 class="text-xl mb-4 text-gray-700 dark:text-gray-300">Add New Class</h2>
                <form id="addClassForm" method="POST" action="{{ route('classes.store') }}">
                    @csrf
                    <div class="mb-4">
                        <label for="class_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Class Name</label>
                        <input type="text" name="class_name" id="class_name" class="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm" required>
                    </div>
                    <div class="flex justify-end">
                        <button type="button" id="cancelAddButton" class="mr-4 px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit Class Modal -->
    <div id="editClassModal" class="fixed z-10 inset-0 overflow-y-auto hidden">
        <div class="flex items-center justify-center min-h-screen">
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 class="text-xl mb-4 text-gray-700 dark:text-gray-300">Edit Class</h2>
                <form id="editClassForm" method="POST" action="">
                    @csrf
                    @method('PUT')
                    <div class="mb-4">
                        <label for="edit_class_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Class Name</label>
                        <input type="text" name="class_name" id="edit_class_name" class="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm" required>
                    </div>
                    <div class="flex justify-end">
                        <button type="button" id="cancelEditButton" class="mr-4 px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('addClassButton').addEventListener('click', function() {
            document.getElementById('addClassModal').classList.remove('hidden');
        });

        document.getElementById('cancelAddButton').addEventListener('click', function() {
            document.getElementById('addClassModal').classList.add('hidden');
        });

        document.querySelectorAll('.editClassButton').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const name = this.getAttribute('data-name');
                // const token = this.getAttribute('data-token');

                document.getElementById('edit_class_name').value = name;
                // document.getElementById('edit_token').value = token;
                document.getElementById('editClassForm').action = `/classes/${id}`;

                document.getElementById('editClassModal').classList.remove('hidden');
            });
        });

        document.getElementById('cancelEditButton').addEventListener('click', function() {
            document.getElementById('editClassModal').classList.add('hidden');
        });
    </script>
</x-app-layout>
