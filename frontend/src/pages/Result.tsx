import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Result() {
  const [searchParams] = useSearchParams();
  const [paramsList, setParamsList] = useState<{key: string, value: string}[]>([]);
  
  const responseCode = searchParams.get('vnp_ResponseCode');
  const isSuccess = responseCode === '00';
  const isValidSignature = searchParams.get('isValidSignature') === 'true';

  useEffect(() => {
    const list: {key: string, value: string}[] = [];
    searchParams.forEach((value, key) => {
      // Bỏ qua tham số isValidSignature do backend tự thêm vào
      if (key !== 'isValidSignature') {
        let displayValue = value;
        // Format lại amount (VNPAY nhân 100)
        if (key === 'vnp_Amount') {
          displayValue = (Number(value) / 100).toLocaleString('vi-VN') + ' VNĐ';
        }
        list.push({ key, value: displayValue });
      }
    });
    // Sắp xếp alphabet
    list.sort((a, b) => a.key.localeCompare(b.key));
    setParamsList(list);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className={`px-6 py-8 text-center ${isSuccess ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex justify-center mb-4">
              {isSuccess ? (
                <CheckCircle className="h-16 w-16 text-green-500" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500" />
              )}
            </div>
            <h2 className={`text-3xl font-bold ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
              {isSuccess ? 'Thanh toán thành công' : 'Giao dịch thất bại'}
            </h2>
            <p className={`mt-2 text-sm ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
              Mã phản hồi: {responseCode || 'Không xác định'}
            </p>
          </div>

          {/* Signature Verification */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-center gap-2">
            {isValidSignature ? (
               <><ShieldCheck className="text-blue-500 w-5 h-5"/> <span className="text-sm font-medium text-gray-700">Chữ ký số hợp lệ (Dữ liệu toàn vẹn)</span></>
            ) : (
               <><AlertCircle className="text-red-500 w-5 h-5"/> <span className="text-sm font-medium text-red-600">Cảnh báo: Chữ ký số không hợp lệ!</span></>
            )}
          </div>

          {/* Details Table */}
          <div className="px-6 py-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Chi tiết giao dịch</h3>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Tham số
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Giá trị
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {paramsList.map((item, index) => (
                    <tr key={item.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 font-mono">
                        {item.key}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 font-mono break-all max-w-xs">
                        {item.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 flex justify-center">
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
