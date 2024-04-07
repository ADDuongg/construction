<?php


use App\Http\Controllers\AssignStaffController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BuildingPermitController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\ContractorController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ExtendProjectController;
use App\Http\Controllers\HireReceiptController;
use App\Http\Controllers\ImportReceiptController;
use App\Http\Controllers\MachineController;
use App\Http\Controllers\MatterialsController;
use App\Http\Controllers\ContractPaymentController;
use App\Http\Controllers\ExtendContractController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectStateController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\StatePaymentController;
use App\Http\Controllers\StatisticController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::resource('/staff', StaffController::class);
    Route::resource('/matterial', MatterialsController::class);
    Route::resource('/machine', MachineController::class);
    Route::resource('/contractor', ContractorController::class);
    Route::resource('/customer', CustomerController::class);
    Route::resource('/schedule', ScheduleController::class);
    Route::resource('/buildingPermit', BuildingPermitController::class);
    Route::resource('/extendProject', ExtendProjectController::class);
    Route::resource('/extendContract', ExtendContractController::class);
    Route::resource('/assignStaff', AssignStaffController::class);
    Route::resource('/attendance', AttendanceController::class);
    Route::resource('paymentStates', StatePaymentController::class);
    Route::put('/detailAttendance/{id}', [AttendanceController::class, 'updateDetail']);
    Route::post('/schedule/deleteAll', [ScheduleController::class, 'deleteAll']);
    Route::resource('paymentContracts', ContractPaymentController::class);
    Route::resource('/projectState', ProjectStateController::class);
    Route::resource('/contract', ContractController::class);
    Route::get('/allcontract', [ContractController::class, 'getAllContract']);

    Route::resource('/project', ProjectController::class);

    Route::post('/blueprint', [ProjectController::class, 'addBluePrint']);
    Route::put('/blueprint', [ProjectController::class, 'UpdateBluePrint']);


    Route::resource('/importMatterial', ImportReceiptController::class);
    Route::get('getInfomation', [ImportReceiptController::class, 'getInfo']);

    Route::resource('/hireMachine', HireReceiptController::class);
    Route::get('getInfomationMachine', [HireReceiptController::class, 'getInfo']);

    Route::resource('/statistic', StatisticController::class);

    Route::get('machineStatistic', [StatisticController::class, 'getMachine']);
    Route::get('matterialStatistic', [StatisticController::class, 'getMatterial']);
});
/* Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    $user = User::all();
    return response()->json([
        'user'=>$user
    ]);
}); */
Route::post('login', [AuthController::class, 'login'])->name('login');
Route::post('register', [AuthController::class, 'register']);
