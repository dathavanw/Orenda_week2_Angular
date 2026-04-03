export interface Customer {
  id: number;
  customerCode: string;
  fullName: string;
  age: number;
  address: string;
  guardianName?: string; // Tên người giám hộ
  guardianPhone?: string; // SĐT người giám hộ
}